const express = require("express");
const upload = require("../../services/fileUploader")
const petitionValidator = require("../../validators/petitionValidator.js");
const Users = require("../../model/users.js");
const Petition = require("../../model/petition.model.js");
const commentValidator = require("../../validators/comment-validator.js");

const commonUsersPetition = express.Router();


commonUsersPetition.post("/add-petition",upload.single('file'), async (req, res) => {
  try {
    const image = process.env.BASE_URI+'/uploads/' + req.file?.filename || ''
      const { error } = petitionValidator.validate({
        title: req.body.title,
        description: req.body.description,
      });

      if (error) return res.status(400).json(error.details[0].message);
      const {title, description,category,goal} = req.body;
      const user = await Users.findById(req.user._id);        
      const petition = new Petition({
        title,
        description,
        image,
        category,
        goal,
        user: {
        name: user.name,
        id: user._id,
        email: user.email,
        contact: user.email,
        cid: user.cid,
        location: user.location
        }
      })

      const endorsementSaved = await petition.save();
      return res.status(200).json(endorsementSaved);
   
  } catch (err) {
    console.log(err)
    res.status(400).json("Could not create petition!");
  }
});

commonUsersPetition.post("/edit-petition", async (req, res) => {
    try {
        const { error } = petitionValidator.validate({
          title: req.body.title,
          description: req.body.description,
        });
  
        if (error) return res.status(400).json(error.details[0].message);
        const {title, description,image} = req.body;
        const petition = await Petition.findByIdAndUpdate(req.body.petitionId,{
          title,
          description,
          image
        },{new: true} )
  
        const endorsementSaved = await petition.save();
  
        return res.status(200).json(endorsementSaved);
     
    } catch (err) {
      console.log(err)
      res.status(400).json("Could not update petition!");
    }
  });



commonUsersPetition.post("/delete-petition", async (req, res) => {
  const id = req.body.petitionId;

  try {
      const deleted = await Petition.findByIdAndDelete(id)
      return res.status(200).json("petition deleted successfully ");
   
  } catch (err) {
    res.status(500).json("could not delete !");
  }
});

commonUsersPetition.post("/comment-petition", async (req, res) => {
    try {
        const { error } = commentValidator.validate(req.body);
  
        if (error) return res.status(400).json(error.details[0].message);
        const {comment,petitionId, rating} = req.body;
        const user = await Users.findById(req.user._id)
        const petition = await Petition.findById(petitionId)
        petition.comments.unshift({
            comment,
            rating,
            user:{
                name: user.name,
                id: user._id,
                email: user.email,
                contact: user.contact,
                cid: user.cid,
                location:user.location,
            }
        })
  
        const endorsementSaved = await petition.save();
  
        return res.status(200).json(endorsementSaved);
     
    } catch (err) {
      res.status(400).json("Could not comment petition!");
    }
  });

  commonUsersPetition.post("/sign-petition", async (req, res) => {
    try {
        const {comments,email,name,address,petitionId} = req.body;
        const petition = await Petition.findById(petitionId)
        petition.signatures.unshift({
            comments,
            email,
            name,
            address 
        })
  
        const endorsementSaved = await petition.save();
  
        return res.status(200).json(endorsementSaved);
     
    } catch (err) {
      res.status(400).json("Could not sign petition!");
    }
  });

module.exports = commonUsersPetition;
