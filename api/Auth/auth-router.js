const route = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const users = require("../Users/users-model");
const {
  checkPayload,
  checkUsername,
  checkLogin,
} = require("./auth-middleware");

// check to see if username exists
// check to see if payload includes both username and password,
route.post("/register", checkPayload, checkUsername, async (req, res, next) => {
  try {
    const newUser = req.body;
    const hash = bcrypt.hashSync(newUser.password, 10);
    newUser.password = hash;

    const added = await users.add(newUser);

    if (added) {
      res
        .status(201)
        .json({ message: "user successfully create", user: added });
    } else {
      res.status(400).json({ message: "failed to create new User" });
    }
  } catch (err) {
    console.log("catch");
    res.status(500).json({ message: "something is UP" });
    // next(err); //!
  }
});

route.post("/login", checkLogin, async (req, res, next) => {
  console.log("req.body>>>", req.body);
  try {
    let { username, password } = req.body;
    const user = await users.findByUsername(username).first();

    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user);
      res.status(200).json({ message: `Welcome ${username}`, token });
    } else {
      res.status(400).json({ message: "invalid" });
    }
  } catch (error) {
    res.status(500).json({ message: "something is UP" });
    console.log("catch of /login in users-model.js", error);
  }
});

function generateToken(user) {
  const payload = {
    sub: user.user_id,
    username: user.username,
  };
  const secret = "test"; //!
  const options = {
    expiresIn: "1h",
  };

  return jwt.sign(payload, secret, options);
}

module.exports = route;
