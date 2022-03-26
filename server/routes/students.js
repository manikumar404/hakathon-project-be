const express = require("express");
const modulesRecord = require("../model/modulesRecord.js");
const modulesMapping = require("../model/moduleMapping.js");
const attendanceRecord = require("../model/attendanceRecord.js");

const students = express.Router();

students.get("/my-class", async (req, res) => {
  const { studentId } = req.query; //userId is the _id of student
  try {
    if (req.user._id === studentId) {
      const module_mapping = await modulesMapping.find({ userId: studentId });

      const idList = [];
      for (const x of module_mapping) {
        idList.push(x.moduleId);
      }

      const myClass = await modulesRecord.find({
        _id: { $in: idList },
      });

      return res.status(200).json(myClass);
    } else {
      return res.status(401).json("you are not authorized!");
    }
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});

students.get("/my-attendance", async (req, res) => {
  const { moduleId, studentId } = req.query;
  try {
    if (req.user._id === studentId) {
      const attendanceList = await attendanceRecord.find({
        moduleId,
        studentId,
      });

      res.status(200).json(attendanceList);
    } else {
      return res.status(401).json("Authorization error");
    }
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});

students.post("/put-present/", async (req, res) => {
  const { moduleId, studentId } = req.query;
  try {
    if (req.user._id === studentId) {
      const module_record = await modulesRecord.findOne({ _id: moduleId });
      if (module_record.attendanceAllowed) {
        const attendance_record = new attendanceRecord({
          status: req.body.status,
          moduleId,
          studentId,
          tutorId: module_record.tutorId,
        });

        const saved = await attendance_record.save();
        return res.status(200).json(saved);
      } else {
        return res.status(401).json("Attendance is closed");
      }
    } else {
      return res.status(401).json("Authorization error");
    }
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});

module.exports = students;
