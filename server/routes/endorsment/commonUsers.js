const express = require("express");
const upload = require("../../services/fileUploader")
const endorsementValidator = require("../../validators/endorsementValidator.js");
const Users = require("../../model/users.js");
const Endorsement = require("../../model/endorsement.js");
const commentValidator = require("../../validators/comment-validator.js");

const commonUsersEndorsement = express.Router();


commonUsersEndorsement.post("/add-endorsement",upload.single('file'), async (req, res) => {
  try {
    const image = process.env.BASE_URI+'/uploads/' + req.file?.filename || ''
      const { error } = endorsementValidator.validate({
        title: req.body.title,
        description: req.body.description,
      });

      if (error) return res.status(400).json(error.details[0].message);
      const {title, description} = req.body;
      const user = await Users.findById(req.user._id);        
      const endorsement = new Endorsement({
        title,
        description,
        image,
        goal: req.body.goal,
    roleTitle: req.body.roleTitle,
    category: req.body.category,
    roleDescription: req.body.roleDescription,
        user: {
        name: user.name,
        id: user._id,
            profile: user.profile,
        email: user.email,
        contact: user.contact,
        cid: user.cid,
        location: user.location
        }
      })

      const endorsementSaved = await endorsement.save();
      return res.status(200).json(endorsementSaved);
   
  } catch (err) {
    console.log(err)
    res.status(400).json("Could not create endorsment!");
  }
});

commonUsersEndorsement.post("/edit-endorsement", async (req, res) => {
    try {
        const { error } = endorsementValidator.validate({
          title: req.body.title,
          description: req.body.description,
        });
  
        if (error) return res.status(400).json(error.details[0].message);
        const {title, description,image} = req.body;
        const endorsement = await Endorsement.findByIdAndUpdate(req.body.endorsementId,{
          title,
          description,
          image
        },{new: true} )
  
        const endorsementSaved = await endorsement.save();
  
        return res.status(200).json(endorsementSaved);
     
    } catch (err) {
      console.log(err)
      res.status(400).json("Could not update endorsment!");
    }
  });



commonUsersEndorsement.post("/delete-endorsement", async (req, res) => {
  const id = req.body.endorsementId;

  try {
      const deleted = await Endorsement.findByIdAndDelete(id)
      return res.status(200).json("endorsement deleted successfully ");
   
  } catch (err) {
    res.status(500).json("could not delete !");
  }
});

commonUsersEndorsement.post("/comment-endorsement", async (req, res) => {
    try {
        const { error } = commentValidator.validate(req.body);
  
        if (error) return res.status(400).json(error.details[0].message);
        const {comment,rating,endorsementId} = req.body;
        const user = await Users.findById(req.user._id)
        const endorsement = await Endorsement.findById(endorsementId)
        endorsement.comments.unshift({
            comment,
            rating,
            user:{
                name: user.name,
                id: user._id,
                email: user.email,
                contact: user.contact,
                profile: user.profile,
                cid: user.cid,
                location:user.location,
            }
        })
  
        const endorsementSaved = await endorsement.save();
  
        return res.status(200).json(endorsementSaved);
     
    } catch (err) {
        console.log(err)
      res.status(400).json("Could not comment endorsment!");
    }
  });

  commonUsersEndorsement.post("/endorse-endorsement", async (req, res) => {
    try {
        const { error } = commentValidator.validate({comment:req.body.comment,endorsementId: req.body.endorsementId});
  
        if (error) return res.status(400).json(error.details[0].message);
        const {comment,email,endorsementId} = req.body;
        const user = await Users.findById(req.user._id)
        const endorsement = await Endorsement.findById(endorsementId)
        endorsement.endorse.unshift({
            comment,
            email,  
        })
  
        const endorsementSaved = await endorsement.save();
  
        return res.status(200).json(endorsementSaved);
     
    } catch (err) {
      res.status(400).json("Could not endorse!");
    }
  });

module.exports = commonUsersEndorsement;
