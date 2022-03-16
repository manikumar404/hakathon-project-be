const express = require('express')
const Users = require('../model/users.js')
const Attendance = require('../model/attendance.js')
const attendanceValidator = require('../validators/attendanceValidator.js')
const userValidator = require('../validators/userValidator.js')
const verify = require('../services/verify.js')
const bcrypt = require('bcrypt')

const joi = require('joi')


const common = express.Router()


common.post('/update-password',async (req,res)=>{
    // const {error} = userValidator.validate(req.body)
    // if(error) return res.status(400).json(error.details[0].message)

    
   
    try{
        const salt = await  bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.newPassword,salt)
    !hashedPassword && res.status(400).json("no new password found")
           const updated = await Users.findOneAndUpdate({_id:req.query._id},
            {password:hashedPassword})
         updated &&  res.status(200).json("successful")
         !updated && res.status(401).json("could not update Your Password")
    
    }catch(err){
        res.status(500).json("internal server error")

    }
   
    
})

common.post('/update-detail',async (req,res)=>{
    // const {error} = userValidator.validate(req.body)
    // if(error) return res.status(400).json(error.details[0].message)
   
    try{
           const updated = await Users.findOneAndUpdate({_id:req.query._id},
            {
                name:req.body.name,
                email:req.body.email,
                id:req.body.id,
                gender:req.body.gender,
            })
         
          const {name,email,id,gender} = updated
           res.status(200).json({name,email,id,gender})
    
    }catch(err){
        res.status(500).json("server error")

    }
   
    
})


module.exports =  common