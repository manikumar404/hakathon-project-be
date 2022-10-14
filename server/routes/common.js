const express = require("express");
const bcrypt = require("bcrypt");
const Users = require("../model/users.js");
const passwordValidator = require("../validators/passwordValidator.js");
const userUpdateValidator = require("../validators/userUpdateValidator.js");
const upload = require("../services/fileUploader");
const { rawListeners } = require("../model/users.js");


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

common.post("/update-detail", upload.single('file'),async (req, res) => {
  try {
    const image = process.env.BASE_URI+'/uploads/' + req.file?.filename || '' 
     console.log(req)
    const { error } = userUpdateValidator.validate(req.body);
    if (error) return res.status(400).json(error.details[0].message);
      const updated = await Users.findOneAndUpdate(
        { _id: req.body.userId },

        {
            name: req.body.name,
            email: req.body.email,
            gender: req.body.gender,
            contact: req.body.contact,
            profile: image,
            bio: req.body.bio,
            occupation: req.body.occupation,
            cid: req.body.cid,
            userType: req.body.userType,
            location: req.body.location
        },
        {new: true}
      );

      return res.status(200).json(updated);
  } catch (err) {
    res.status(500).json("server error");
  }
});

common.get("/get-user", async (req, res) => {
  try {
      const user = await Users.findById(req.query.userId);
      return res.status(200).json(user);
    } 
  catch (err) {
    res.status(500).json("Could not find user !");
  }
});

common.get("/get-users", async (req, res) => {
    try {
        const users = await Users.find({});
        return res.status(200).json(users);
      } 
    catch (err) {
      res.status(500).json("Could not find users !");
    }
  });

common.get("/get-users-by-loc", async (req, res) => {
    const {location,limit,skip} = req.query;
    try {
        const petitions = await Users.find({"location.dzongkhag":location},
        'name email gender profile bio occupation contact followers following',
        {limit,skip}
        )
        return res.status(200).json(petitions);
     
    } catch (err) {
      res.status(500).json("could not get users!");
    }
  });

  common.get("/get-user-count", async (req, res) => {
    const {location} = req.query;
    try {
        const posts = Users.find({"location.dzongkhag":location})
        posts.count((err,count)=>{
          err && res.status(500).json("could not get user counts!")
          return res.status(200).json({count})
        })
     
    } catch (err) {
      res.status(500).json("could not get users!");
    }
  });

  common.post("/follow-user", async (req, res) => {
    try {
        const user = await Users.findById(req.body.id);
        user.following.push({
          userId: req.body.userId,
          name: req.body.follower
        })
        await user.save()

        const followed = await Users.findById(req.body.userId);
        user.followers.push({
          userId: req.body.id,
          name: req.body.name
        })
        await followed.save()
        return res.status(200).json("user followed successfully");
      } 
    catch (err) {
      res.status(500).json("Could not find users !");
    }
  });
module.exports = common;
