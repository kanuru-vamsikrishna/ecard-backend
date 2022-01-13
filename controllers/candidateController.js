const Candidate = require("../models/candidates");
const nodemailer = require("nodemailer");
var smtpTransport = require("nodemailer-smtp-transport");

module.exports.Create = (req, res) => {
  const { user } = req;
  const body = req.body;
  body.createdBy = user._id;
  console.log(body, "body");
  const candidate = new Candidate(body);
  candidate
    .save()
    .then((candidate) => {
      const transporter = nodemailer.createTransport(
        smtpTransport({
          service: "gmail",
          auth: {
            user: "kagisorabada406@gmail.com",
            pass: "kagiso9999",
          },
        })
      );

      const mailOptions = {
        from: "kagisorabada406@gmail.com",
        to: `${user.email}`,
        subject: "Candidate Id",
        text: `eCard application.`,
        html: `<h1>This is an email for candidate registration success on eCard application.</h1>
                  <br/>
                <h4>Candidate Name: ${candidate.name}</h4>
                <br/>
                <h4>Candidate Id: ${candidate._id}</h4>
                <br />
                Thank you.
                `,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
          res.status(200).json({
            status: 200,
            response: candidate,
            message: "Successfully created Candidate",
          });
        }
      });
    })
    .catch((err) => {
      res.status(401).json({
        status: 401,
        response: err,
        message: "Failed to create candidate",
      });
    });
};

module.exports.List = (req, res) => {
  Candidate.find({ createdBy: req.user._id })
    .then((candidate) => {
      res.status(200).json({
        status: 200,
        response: candidate,
        message: "Fetched all Candidates Successfully",
      });
    })
    .catch((err) => {
      res.status(401).json({
        status: 401,
        response: err,
        message: "Unable to Fetch Candidates",
      });
    });
};

module.exports.Show = (req, res) => {
  const id = req.params.id;
  Candidate.findById({ _id: id, createdBy: req.user._id })
    .then((candidate) => {
      if (candidate) {
        res.status(200).json({
          status: 200,
          response: candidate,
          message: "Fetched Candidate Successfully",
        });
      } else {
        res.json({});
      }
    })
    .catch((err) => {
      res.status(400).json({
        status: 400,
        response: err,
        message: "Failed to Fetch candidate",
      });
    });
};

module.exports.Update = (req, res) => {
  const id = req.params.id;
  const body = req.body;
  Candidate.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  })
    .then((candidate) => {
      if (candidate) {
        res.status(200).json({
          status: 200,
          response: candidate,
          message: "Updated Candidate Successfully",
        });
      } else {
        res.json({});
      }
    })
    .catch((err) => {
      res.status(401).json({
        status: 401,
        response: err,
        message: "Failed to Update Candidate",
      });
    });
};

module.exports.Delete = (req, res) => {
  const id = req.params.id;
  Candidate.findByIdAndDelete({ _id: id, createdBy: req.user._id })
    .then((candidate) => {
      if (candidate) {
        res.status(200).json({
          status: 200,
          response: candidate,
          message: "Successfully deleted candidate",
        });
      } else {
        res.json({});
      }
    })
    .catch((err) => {
      res.status(401).json({
        status: 401,
        response: err,
        message: "Failed to delete Candidate",
      });
    });
};
