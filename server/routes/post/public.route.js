const express = require("express");
const Post = require("../../model/post.model.js");
const publicUsersPost = express.Router();


publicUsersPost.get("/get-post", async (req, res) => {
    const id = req.query.endorsementId;
  
    try {
        const post = await Post.findById(id)
        return res.status(200).json(post);
     
    } catch (err) {
      res.status(500).json("could not get specified post!");
    }
  });

  publicUsersPost.get("/get-posts-of-user", async (req, res) => {
    const id = req.query.userId;
  
    try {
        const posts = await Post.find({"user.id":id})
        return res.status(200).json(posts);
     
    } catch (err) {
      res.status(500).json("could not get posts!");
    }
  });

  publicUsersPost.get("/get-posts", async (req, res) => {
    const {skip,limit} = req.query;
    try {
        const posts = await Post.find({},
          'title description image user comments',
          {skip,limit})
        return res.status(200).json(posts);
     
    } catch (err) {
      console.log(err)
      res.status(500).json("could not get posts!");
    }
  });


module.exports = publicUsersPost;
