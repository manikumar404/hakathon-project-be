const express = require("express");
const Endorsement = require("../../model/endorsement.js");
const publicUsersEndorsement = express.Router();
const commentValidator = require("../../validators/comment-validator")
const Users = require("../../model/users")


publicUsersEndorsement.get("/get-endorsement", async (req, res) => {
    const id = req.query.endorsementId;
  
    try {
        const endorsement = await Endorsement.findById(id)
        return res.status(200).json(endorsement);
     
    } catch (err) {
      res.status(500).json("could not get specified endorsment!");
    }
  });

  publicUsersEndorsement.get("/get-endorsements-of-user", async (req, res) => {
    const id = req.query.userId;
  
    try {
        const endorsements = await Endorsement.find({"user.id":id})
        return res.status(200).json(endorsements);
     
    } catch (err) {
      res.status(500).json("could not get endorsments!");
    }
  });

  publicUsersEndorsement.get("/get-endorsements", async (req, res) => {
    const {skip,limit} = req.query;
    try {
        const endorsements = await Endorsement.find({},
          'title description image user comments goal roleTitle category roleDescription endorse',
          {skip,limit})
        return res.status(200).json(endorsements);
     
    } catch (err) {
      console.log(err)
      res.status(500).json("could not get endorsments!");
    }
  });

  publicUsersEndorsement.get("/get-endorsement-count", async (req, res) => {
    const {location} = req.query;
    try {
        const endorsement = Endorsement.find({"user.location.dzongkhag":location})
        endorsement.count((err,count)=>{
          err && res.status(500).json("could not get endorsement counts!")
          return res.status(200).json({count})
        })
     
    } catch (err) {
      res.status(500).json("could not get endorsements!");
    }
  });

  publicUsersEndorsement.get("/get-endorsements-by-loc", async (req, res) => {
    const {location,limit,skip} = req.query;
    try {
        const endorsements = await Endorsement.find({"user.location.dzongkhag":location},
        'title description image user comments goal roleTitle category roleDescription endorse',
        {limit,skip}
        )
        return res.status(200).json(endorsements);
     
    } catch (err) {
      console.log(err)
      res.status(500).json("could not get endorsements!");
    }
  });

  publicUsersEndorsement.post("/endorse-endorsement", async (req, res) => {
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


module.exports = publicUsersEndorsement;
