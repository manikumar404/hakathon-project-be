const express = require("express");
const userValidator = require("../validators/userValidator.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../model/users.js");
const upload = require("../services/fileUploader");


const auth = express.Router();

auth.post("/register", upload.single('file'),async (req, res) => {
  try {
    // const { error } = userValidator.validate(req.body);
    // if (error) return res.status(400).json(error.details[0].message);
    const image = process.env.BASE_URI+'/uploads/' + req.file?.filename || '' 

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new Users({
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
          contact: req.body.contact,
          cid: req.body.cid,
          location: req.body.location,
          profile: image,
          location: {
            dzongkhag: req.body.location
          }

        });
        const user = await newUser.save();
        res.status(200).send(user);
  } catch (err) {
    if (err.code) {
      console.log(err)
      res.status(500).json("Email is already used");
    } else {
      res.status(500).json("Internal server error");
    }
  }
});


auth.post("/login", async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await Users.findOne({ email });
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
