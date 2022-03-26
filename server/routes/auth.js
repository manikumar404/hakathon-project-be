const express = require("express");
const userValidator = require("../validators/userValidator.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usersRecord = require("../model/userRecord.js");
const currentState = require("../model/properties.js");

const auth = express.Router();

auth.post("/register", async (req, res) => {
  try {
    const { error } = userValidator.validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);
    if (req.body.userType === "tutor") {
      const property = await currentState.findOne({
        propertyName: "Tutors-Token",
      });
      if (property?.value === req.body.token) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new usersRecord({
          name: req.body.name,
          email: req.body.email,
          gender: req.body.gender,
          password: hashedPassword,
          userType: req.body.userType,
          department: req.body.department,
        });
        const user = await newUser.save();
        res.status(200).send(user);
      } else {
        return res.status(401).json("Wrong Token");
      }
    }
    if (req.body.userType === "student") {
      const property = await currentState.findOne({
        propertyName: "Students-Token",
      });
      if (property?.value === req.body.token) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new usersRecord({
          name: req.body.name,
          email: req.body.email,
          gender: req.body.gender,
          password: hashedPassword,
          userType: req.body.userType,
          department: req.body.department,
        });
        const user = await newUser.save();
        res.status(200).send(user);
      } else {
        return res.status(401).json("Wrong Token");
      }
    }
  } catch (err) {
    if (err.code) {
      res.status(500).json("Email is already used");
    } else {
      res.status(500).json("Internal server error");
    }
  }
});

auth.post("/login", async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await usersRecord.findOne({ email });
    if (!user) return res.status(400).json("Email not found");
    const authenticate = await bcrypt.compare(password, user.password);
    if (!authenticate) return res.status(401).json("wrong password");

    user.password = "0";
    const token = jwt.sign(
      { _id: user._id, userType: user.userType },
      process.env.SECRET
    );
    res.status(200);
    res.send({ user, token });
  } catch (err) {
    res.json("internal server error");
  }
});

module.exports = auth;
