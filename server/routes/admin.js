const express = require("express");
const Users = require("../model/users.js");
const Attendance = require("../model/attendance.js");
const currentState = require("../model/properties");

const admin = express.Router();

admin.delete("/delete-account/", async (req, res) => {
  try {
    const deleted = await Users.findOneAndDelete({ email: req.query.email });
    res.status(200).json("successful");
  } catch (err) {
    res.status(500).json(err);
  }
});
admin.delete("/delete-class/", async (req, res) => {
  try {
    const deleted = await Attendance.findOneAndDelete({
      email: req.query.moduleCode,
    });
    res.status(200).json("successful");
  } catch (err) {
    res.status(500).json(err);
  }
});
admin.get("/all-classes/", async (req, res) => {
  try {
    const classes = await Attendance.find();
    res.status(200).json(classes);
  } catch (err) {
    res.status(500).json(err);
  }
});

admin.get("/all-students/", async (req, res) => {
  try {
    const all = await Users.find({ userType: "student" });
    res.status(200).json(all);
  } catch (err) {
    res.status(500).json(err);
  }
});
admin.get("/all-tutors/", async (req, res) => {
  try {
    const all = await Users.find({ userType: "tutor" });
    res.status(200).json(all);
  } catch (err) {
    res.status(500).json(err);
  }
});

admin.post("/create-token/", async (req, res) => {
  try {
    const token = await currentState.find();
    if (token.length > 1) {
      const newToken = new currentState({
        propertyName: req.body.propertyName,
        value: req.body.value,
      });
      const saved = await newToken.save();
      res.status(200).json(saved);
    } else {
      token[0] = {
        propertyName: req.body.propertyName,
        value: req.body.value,
      };

      const savedToken = await token.save();
      res.status(200).json(savedToken);
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

admin.get("/token/", async (req, res) => {
  try {
    const token = await currentState.find();
    res.status(200).json(token[0]);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = admin;
