const express = require("express");
const bcrypt = require("bcrypt");
const Users = require("../model/users.js");
const passwordValidator = require("../validators/passwordValidator.js");
const userUpdateValidator = require("../validators/userUpdateValidator.js");

const common = express.Router();

common.post("/update-password", async (req, res) => {
  try {
    const { error } = passwordValidator.validate({newPassword:req.body.newPassword});
    if (error) return res.status(400).json(error.details[0].message);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
      if (!hashedPassword) return res.status(400).json("No new password found");
      const updated = await Users.findOneAndUpdate(
        { _id: req.body.userId },
        { password: hashedPassword }
      );
      if (updated) return res.status(200).json("Successful");
      if (!updated)
        return res.status(401).json("Could not update your password");
    
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});

common.post("/update-detail", async (req, res) => {
  try {
    const { error } = userUpdateValidator.validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);
      const updated = await Users.findOneAndUpdate(
        { _id: req.body.userId },

        {
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            contact: req.body.contact,
            cid: req.body.cid,
            userType: req.body.userType,
            location: req.body.location
        }
      );

      return res.status(200).json(updated);
  } catch (err) {
    res.status(500).json("server error");
  }
});

common.post("/get-user", async (req, res) => {
  try {
      const user = await Users.findById(req.body.userId);
      return res.status(200).json(user);
    } 
  catch (err) {
    res.status(500).json("Could not find user !");
  }
});

common.post("/get-users", async (req, res) => {
    try {
        const users = await Users.find({});
        return res.status(200).json(users);
      } 
    catch (err) {
      res.status(500).json("Could not find users !");
    }
  });

module.exports = common;
