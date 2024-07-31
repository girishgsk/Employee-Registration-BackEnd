const express = require("express");
const router = new express.Router();
const { user } = require("../models/db");
// const bcrypt = require("bcrypt");

// const saltRounds = 10;

//-----------Signup-----------

router.post("/signup", async (req, res) => {
  let status = "error";
  let message = "Someting went wrong , try again";
  let reqStatus = 400;
  let inserted_id = undefined;

  const validateUser = [];

  if (!req.body?.userName) {
    validateUser.push("userName field is reqired");
  }
  if (!req.body?.password) {
    validateUser.push("Passworg is required");
  }
  if (validateUser.length > 0) {
    res.status(reqStatus);
    return res.status(400).json({ message: validateUser, status });
  }

  try {
    const register = await new user(req.body).save();
    // res.status(200).send();
    if (register) {
      status = "success";
      message = "User added successfully!";
      reqStatus = 200;
      inserted_id = register?._id;
    }
  } catch (err) {
    message = err;
  }
  return res
    .status(reqStatus)
    .json({ status, message, id: inserted_id, userName: req.body.userName });
});

//---------------Login-----------------------

router.post("/login", async (req, res) => {
  let status = "error";
  let message = "Someting went wrong , try again";
  let reqStatus = 400;
  const validateUser = [];

  if (!req.body?.userName) {
    validateUser.push("userName field is reqired");
  }
  if (!req.body?.password) {
    validateUser.push("Passworg is required");
  }
  if (validateUser.length > 0) {
    res.status(reqStatus);
    return res.status(400).json({ message: validateUser, status });
  }

  try {
    const UserName = req.body.userName;
    const Password = req.body.password;

    if (!UserName || !Password) {
      return res.status(400).json({ error: "both field is require" });
    }

    const loginUser = await user.find(
      { userName: UserName } && { password: Password }
    );

    if (loginUser.length > 0) {
      res
        .status(200)
        .json({ message: "success", userName: loginUser[0]?.userName });
    } else {
      return res.status(400).json({ error: "Login details are invalide" });
    }
  } catch (error) {
    return res.status(400).json({ error: "Login details are invalide" });
  }
});

module.exports = router;
