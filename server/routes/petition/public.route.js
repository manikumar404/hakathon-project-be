const express = require("express");
const Petition = require("../../model/petition.model.js");
const publicUsersPetition = express.Router();


publicUsersPetition.get("/get-petition", async (req, res) => {
    const id = req.query.petitionId;
  
    try {
        const petition = await Petition.findById(id)
        return res.status(200).json(petition);
     
    } catch (err) {
      res.status(500).json("could not get specified petition!");
    }
  });

  publicUsersPetition.get("/get-petitions-of-user", async (req, res) => {
    const id = req.query.userId;
  
    try {
        const petitions = await Petition.find({"user.id":id})
        return res.status(200).json(petitions);
     
    } catch (err) {
      res.status(500).json("could not get petition!");
    }
  });

  publicUsersPetition.get("/get-petitions", async (req, res) => {
    const {skip,limit} = req.query;
    try {
        const petitions = await Petition.find({},
          'title description image user comments category goal signatures',
          {skip,limit})
        return res.status(200).json(petitions);
     
    } catch (err) {
      console.log(err)
      res.status(500).json("could not get petition!");
    }
  });


module.exports = publicUsersPetition;
