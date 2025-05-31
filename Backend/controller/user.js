const User = require('../models/users');

// Login user
const loginUser = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    console.log("USER: ", user);
    if (user) {
      res.send(user);
      // Store the user in the session
      req.session.user = user;
    } else {
      res.status(401).send("Invalid Credentials");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

// Get current logged in user
const getCurrentUser = (req, res) => {
  // If using sessions
  if (req.session && req.session.user) {
    res.send(req.session.user);
  } else {
    res.status(401).send("No user logged in");
  }
};

// Register new user
const registerUser = (req, res) => {
  let registerUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    imageUrl: req.body.imageUrl,
  });

  registerUser
    .save()
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log("Signup error: ", err);
      res.status(400).send(err);
    });
  console.log("request: ", req.body);
};

// Logout user
const logoutUser = (req, res) => {
  if (req.session) {
    req.session.user = null;
    res.status(200).send({ message: "Logged out successfully" });
  } else {
    res.status(400).send({ message: "No session found" });
  }
};

module.exports = {
  loginUser,
  getCurrentUser,
  registerUser,
  logoutUser
};
