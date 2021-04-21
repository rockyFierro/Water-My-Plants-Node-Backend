// import

const express = require("express");
const helmet = require("helmet");

const authRouter = require("./Auth/auth-router");
// const userRouter = require("./Users/users-router");
// const plantRouter = require('./Plants/plants-router')

// create
const server = express();

// configure
server.use(express.json());
server.use(helmet());
server.use("/api/auth", authRouter);
// server.use('/api/users', userRouter)
// server.use('/api/plants', plantRouter)


const user = require("./Users/users-model");

server.get("/allUsers", async (req, res) => {
  const allUsers = await user.getAll();
  if (allUsers) {
    res.status(200).json(allUsers);
  } else {
    res.status(400).json({ message: "cannot get all users" });
  }
});

server.get("/", (req, res) => {
  res.status(200).json({ message: "api up and deployed" });
});

module.exports = server;
