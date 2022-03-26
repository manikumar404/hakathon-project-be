const express = require("express");
const attendanceValidator = require("../validators/attendanceValidator.js");
const userValidator = require("../validators/userValidator.js");
const verify = require("../services/verify.js");
const bcrypt = require("bcrypt");
const joi = require("joi");
const usersRecord = require("../model/userRecord.js");
const passwordValidator = require("../validators/passwordValidator.js");
const userUpdateValidator = require("../validators/userUpdateValidator.js");

const common = express.Router();

common.post("/update-password", async (req, res) => {
  try {
    const { error } = passwordValidator.validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    if (req.user._id === req.query.userId) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
      if (!hashedPassword) return res.status(400).json("No new password found");
      const updated = await usersRecord.findOneAndUpdate(
        { _id: req.query.userId },
        { password: hashedPassword }
      );
      if (updated) return res.status(200).json("Successful");
      if (!updated)
        return res.status(401).json("Could not update your password");
    } else {
      return res.status(401).json("You are not authorized!");
    }
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});

common.post("/update-detail", async (req, res) => {
  try {
    const { error } = userUpdateValidator.validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);

    if (req.user._id === req.query.userId) {
      const updated = await usersRecord.findOneAndUpdate(
        { _id: req.query.userId },

        {
          name: req.body.name,
          email: req.body.email,
          id: req.body.id,
          gender: req.body.gender,
        }
      );

      const { name, email, id, gender } = updated;
      return res.status(200).json({ name, email, id, gender });
    } else {
      return res.status(401).json("you are not authorized!");
    }
  } catch (err) {
    res.status(500).json("server error");
  }
});

module.exports = common;
