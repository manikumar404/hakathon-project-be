const express = require("express");
const upload = require("../../services/fileUploader")
const postValidator = require("../../validators/postValidator.js");
const Users = require("../../model/users.js");
const Post = require("../../model/post.model.js");
const commentValidator = require("../../validators/comment-validator.js");

const commonUsersPost = express.Router();


commonUsersPost.post("/add-post",upload.single('file'), async (req, res) => {
  try {
    const image = process.env.BASE_URI+'/uploads/' + req.file?.filename || ''
      const { error } = postValidator.validate({
        title: req.body.title,
        description: req.body.description,
      });

      if (error) return res.status(400).json(error.details[0].message);
      const {title, description,category} = req.body;
      const user = await Users.findById(req.user._id);        
      const post = new Post({
        title,
        description,
        image,
        category,
        user: {
        name: user.name,
        id: user._id,
            profile: user.profile,
        email: user.email,
        contact: user.email,
        cid: user.cid,
        location: user.location
        }
      })

      const postSaved = await post.save();
      return res.status(200).json(postSaved);
   
  } catch (err) {
    console.log(err)
    res.status(400).json("Could not create post!");
  }
});

commonUsersPost.post("/edit-post", async (req, res) => {
    try {
        const { error } = postValidator.validate({
          title: req.body.title,
          description: req.body.description,
        });
  
        if (error) return res.status(400).json(error.details[0].message);
        const {title, description,image} = req.body;
        const post = await Post.findByIdAndUpdate(req.body.petitionId,{
          title,
          description,
          image
        },{new: true} )
  
        const postSaved = await post.save();
  
        return res.status(200).json(postSaved);
     
    } catch (err) {
      console.log(err)
      res.status(400).json("Could not update post!");
    }
  });



commonUsersPost.post("/delete-post", async (req, res) => {
  const id = req.body.postId;

  try {
      const deleted = await Post.findByIdAndDelete(id)
      return res.status(200).json("post deleted successfully ");
   
  } catch (err) {
    res.status(500).json("could not delete !");
  }
});

commonUsersPost.post("/comment-post", async (req, res) => {
    try {
        // const { error } = commentValidator.validate(req.body);
        //
        // if (error) return res.status(400).json(error.details[0].message);
        const {comment,petitionId,rating} = req.body;
        const user = await Users.findById(req.user._id)
        const post = await Post.findById(petitionId)
        post.comments.unshift({
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
  
        const postSaved = await post.save();
  
        return res.status(200).json(postSaved);
     
    } catch (err) {
      res.status(400).json("Could not comment post!");
    }
  });

module.exports = commonUsersPost;
