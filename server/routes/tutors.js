const { json } = require("body-parser");
const express = require("express");
const { find } = require("../model/attendance.js");
const Attendance = require("../model/attendance.js");
const Users = require("../model/users.js");
const classValidator = require("../validators/classValidator.js");

const tutors = express.Router();

tutors.post("/add-class", async (req, res) => {
  //const {error} = attendanceValidator.validate(req.body)
  //if(error) return res.status(400).json(error)

  const { className, moduleCode, tutor, classStrength, credit } = req.body;
  try {
    const userList = await Users.findOne({ _id: tutor });
    const newAttendance = new Attendance({
      className,
      moduleCode,
      tutor,
      classStrength,
      credit,
    });
    const attendance = await newAttendance.save();
    userList.moduleList.push({ className, moduleCode });
    await userList.save();
    res.send({ className, moduleCode });
  } catch (err) {
    res
      .status(400)
      .json("error occured! please check your inputs and try again");
  }
});

tutors.post("/add-student", async (req, res) => {
  const { email, id } = req.body;

  try {
    const newModule = await Attendance.findOne({ _id: id });
    const user = await Users.findOne({ email });
    const added = {
      _id: user._id,
      id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      attendance: [],
    };
    newModule.students.push(added);
    user.moduleList.push({
      id: newModule._id,
      className: newModule.className,
      moduleCode: newModule.moduleCode,
    });
    user.moduleList = [
      ...new Map(user.moduleList.map((item) => [item["_id"], item])).values(),
    ];

    const student = await newModule.save();
    await user.save();
    res.send(added);
  } catch (err) {
    res.status(500).json(err);
  }
});

tutors.delete("/delete-student", async (req, res) => {
  const { stdId, _id } = req.query;

  try {
    const newModule = await Attendance.findOne({ _id });
    const user = await Users.findOne({_id:stdId})
    const index = newModule.students.findIndex((std) => std.id === stdId);
    const index2 = user.moduleList.findIndex((mod) => mod.id === _id);
    newModule.students.splice(index, 1);
    user.moduleList.splice(index2)
    await user.save()
    const student = await newModule.save();
    res.send(student);
  } catch (err) {
    res.status(500).json(err);
  }
});

tutors.post("/take-attendance", async (req, res) => {
  const { id, attendance } = req.body;
  const newModule = await Attendance.findOne({ _id: id });

  try {
    for (const att of attendance) {
      newModule.students[att.serial].attendance.push({ status: att.status });
    }
    const attendanceS = await newModule.save();
    res.send(attendanceS.students);
  } catch (err) {
    res.status(500).json(err);
  }
});

tutors.post("/change-attendance", async (req, res) => {
  const { status, stdId, attSerial, _id } = req.body;

  try {
    const newModule = await Attendance.findOne({ _id });
    const stdSerial = newModule.students.findIndex((std) => std.id === stdId);
    newModule.students[stdSerial].attendance[attSerial].status = status;
    const attendance = await newModule.save();
    res.send(attendance);
  } catch (err) {
    res.status(500).json(err);
  }
});

tutors.post("/update-class/", async (req, res) => {
  // const {error} = classValidator.validate(req.body)
  //if(error) return res.status(400).json(error)
  const { className, moduleCode, credit, classStrength } = req.body;
  try {
    const claas = await Attendance.findOne({ _id: req.query.id });
    if (claas.tutor !== req.query.tutor)
      return res.status(401).json("you are not allowed to change this class");
    claas.className = className;
    claas.moduleCode = moduleCode;
    claas.credit = credit;
    claas.classStrength = classStrength;
    const updated = await claas.save();
    res.status(200).send(updated);
  } catch (err) {
   // res.status(500).json(err);
    console.log(req.body)
  }
});

tutors.get("/my-class", async (req, res) => {
  try {
    const found = await Attendance.find({ tutor: req.query.id });

    res.status(200).json(found);
  } catch (err) {
    res.status(500).json(err);
  }
});

tutors.get("/select-class", async (req, res) => {
  try {
    const found = await Attendance.findOne({
      moduleCode: req.query.moduleCode,
    });

    res.status(200).json(found);
  } catch (err) {
    res.status(500).json(err);
  }
});

tutors.delete("/delete-class/", async (req, res) => {
  try {
    const deleted = await Attendance.findOneAndDelete({
      moduleCode: req.query.moduleCode,
    });
    const users = await Users.find()
    for (const user of users){
      const index = user.moduleList.findIndex(mod=>mod.moduleCode === req.query.moduleCode)
      user.moduleList.splice(index,1)
      await user.save()
    }
    res.status(200).json("successful");
  } catch (err) {
    res.status(500).json("Internal Server Error");
  }
});

module.exports = tutors;
