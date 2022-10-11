const express = require("express");
const Endorsement = require("../../model/endorsement.js");
const publicUsersEndorsement = express.Router();


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


module.exports = publicUsersEndorsement;
