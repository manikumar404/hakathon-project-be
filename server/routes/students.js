const express = require('express')
const Users = require('../model/users.js')
const Attendance = require('../model/attendance.js')
const { stdin } = require('nodemon/lib/config/defaults')

const students = express.Router()
students.get('/my-attendance',async (req,res)=>{
    const email = req.query.email
    try{
     const attendance = await Attendance.findOne({moduleCode:req.query.moduleCode})
     
     const index = attendance.students.findIndex(stud => stud.email===email)
     const attList = attendance.students[index]
     console.log(email)
    
     res.status(200).json(attList)
   }
    catch(err){
       res.status(500).json(err)
   }
 })

 students.post('/put-present/', async (req,res)=>{
     const id = req.body.id
     try{
        const attendance = await Attendance.findOne({_id:req.query._id})
        const index = attendance.students.findIndex(stud => stud.id===id)
        const attList = await attendance.students[index].push({status:'P'}).save()
        const attListOfOne = await attendance.students[index]

       
        res.status(200).json(attListOfOne)


     }
     catch(err){
        res.status(500).json(err)
    }


 })
 


module.exports =  students