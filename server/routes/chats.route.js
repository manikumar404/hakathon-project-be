const express = require("express");
const Users = require("../model/users.js");
const Chats = require("../model/chats.model")

const chats = express.Router();

chats.post("/post-chat", async (req, res) => {
    try {

        const chat = new Chats({
            id: req.body.id1 + req.body.id2,
            message: req.body.message
        });
        const saved = await chat.save();


        return res.status(200).json(saved);
      } 
    catch (err) {
      res.status(500).json("Could not find users !");
    }
  });

  chats.get("/get-chats",async (req,res)=>{
    try{
        const {id,skip,limit} = req.query
        const chats = await Chats.find({id},
            "id message",
            {skip,limit}
            )
            res.status(200).json(chats)

    }
    catch (err){
        res.status(500).json("Could not find messages !");
    }
  })



module.exports = chats;
