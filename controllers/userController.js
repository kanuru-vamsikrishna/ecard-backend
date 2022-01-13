const User = require("../models/user");

module.exports.Create = (req, res) => {
  const body = req.body;
  console.log(body, "body");
  const user = new User(body);
  user
    .save()
    .then((user) => {
      res.status(200).json({
        status: 200,
        response: user,
        message: "user registered successfully",
      });
    })
    .catch((err) => {
      res.status(403).json({
        status: 403,
        response: err,
        message: "Failed to do registration please try again",
      });
    });
};

module.exports.Login = (req, res) => {
  const body = req.body;
  User.findByCredentials(body.email, body.password)
    .then((user) => {
      console.log(user, "user");
      return user.generateToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports.Account = (req, res) => {
  const { user } = req;
  console.log(user);
  User.findById(user._id)
    .then((user) => {
      if (user) {
        res.status(200).json({
          status: 200,
          response: {
            _id: user._id,
            username: user.username,
            email: user.email,
          },
          message: "Fetched user successfully",
        });
      }
    })
    .catch((err) => {
      res.status(403).json({
        status: 403,
        response: err,
        message: "Failed to fetch user",
      });
    });
};

module.exports.Delete = (req, res) => {
  const { user, token } = req;
  User.findByIdAndUpdate(user._id, { $pull: { tokens: { token: token } } })
    .then(() => {
      res.send({ notice: "successfully logged out" });
    })
    .catch((err) => {
      res.send(err);
    });
};
