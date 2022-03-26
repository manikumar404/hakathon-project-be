const express = require("express");
const classValidator = require("../validators/classValidator.js");
const modulesRecord = require("../model/modulesRecord.js");
const usersRecord = require("../model/userRecord.js");
const modulesMapping = require("../model/moduleMapping.js");
const attendanceRecord = require("../model/attendanceRecord.js");
const classUpdateValidator = require("../validators/classUpdateValidator.js");

const tutors = express.Router();

tutors.post("/add-class", async (req, res) => {
  try {
    if (req.user._id === req.body.tutorId) {
      const { error } = classValidator.validate({
        moduleName: req.body.moduleName,
        moduleCode: req.body.moduleCode,
      });

      if (error) return res.status(400).json(error.details[0].message);

      const { moduleName, moduleCode, tutorId } = req.body;

      const newModulesRecord = new modulesRecord({
        moduleName,
        moduleCode,
        tutorId,
      });
      const moduleRecord = await newModulesRecord.save();
      const moduleMapping = new modulesMapping({
        moduleId: moduleRecord._id,
        userId: tutorId,
        key: moduleRecord._id + tutorId,
      });
      await moduleMapping.save();

      return res.status(200).json({ moduleName, moduleCode });
    } else {
      return res.status(401).json("You are not authorized!");
    }
  } catch (err) {
    res.status(400).json("This module already exists");
  }
});

tutors.post("/add-student", async (req, res) => {
  const { email, moduleId, tutorId } = req.body;

  //body requires Email of student and and _id of module and sends the added student

  try {
    if (req.user._id === tutorId) {
      const user = await usersRecord.findOne({ email });
      if (!user)
        return res.status(400).json("No student found with given email");

      const moduleMap = new modulesMapping({
        moduleId,
        userId: user._id,
        key: moduleId + user._id,
      });
      await moduleMap.save();

      return res.status(200).send(user);
    } else {
      return res.status(401).json("You are not authorized");
    }
  } catch (err) {
    if (err.code) {
      return res.status(409).json("Student already exists");
    } else {
      return res.status(500).json("Internal server error");
    }
  }
});

tutors.delete("/delete-student", async (req, res) => {
  const { moduleId, studentId, tutorId } = req.query;

  try {
    if (req.user._id === tutorId) {
      const deletedStudent = await modulesMapping.findOneAndDelete({
        moduleId,
        userId: studentId,
      });
      const deletedAttendance = await attendanceRecord.deleteMany({
        moduleId,
        studentId,
      });

      return res.status(200).json("Successful");
    } else {
      return res.status(401).json("You are not authorized");
    }
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});

tutors.post("/take-attendance", async (req, res) => {
  const { attendanceData } = req.body;
  const { tutorId } = req.query;

  try {
    if (req.user._id === tutorId) {
      for (const att of attendanceData) {
        const attendanceRecordInstance = new attendanceRecord({
          status: att.status,
          moduleId: att.moduleId,
          studentId: att.studentId,
          tutorId: tutorId,

          //studentId is user_id moduleId is module_id
        });
        await attendanceRecordInstance.save();
      }
      return res.status(200).json("Attendance successfully saved!");
    } else {
      return res.status(401).json("You are not authorized");
    }
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});

tutors.post("/change-attendance", async (req, res) => {
  const { status } = req.body;
  const { attendanceId, tutorId } = req.query;

  try {
    if (req.user._id === tutorId) {
      const attendance_record = await attendanceRecord.findOneAndUpdate(
        { _id: attendanceId },
        { status },
        { new: true }
      );

      return res.status(200).json(attendance_record);
    } else {
      return res.status(401).json("You are not authorized");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

tutors.post("/update-class/", async (req, res) => {
  const { moduleName, moduleCode } = req.body;
  const { moduleId, tutorId } = req.query;
  try {
    if (req.user._id === tutorId) {
      const { error } = classUpdateValidator.validate({
        moduleCode,
        moduleName,
      });
      if (error) return res.status(400).json(error.details[0].message);
      const module_record = await modulesRecord.findOneAndUpdate(
        { _id: moduleId },
        { moduleName, moduleCode },
        { new: true }
      );
      return res.status(200).json(module_record);
    } else {
      return res.status(401).json("You are not authorized");
    }
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});

tutors.get("/my-class", async (req, res) => {
  try {
    if (req.user._id === req.query.tutorId) {
      const myClass = await modulesRecord.find({ tutorId: req.query.tutorId });
      return res.status(200).json(myClass);
    } else {
      return res.status(401).json("You are not authorized");
    }
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});
tutors.get("/all-attendance-of-class", async (req, res) => {
  try {
    if (req.user._id === req.query.tutorId) {
      const attendance = await attendanceRecord.find({
        moduleId: req.query.moduleId,
      });
      return res.status(200).json(attendance);
    } else {
      return res.status(401).json("You are not authorized");
    }
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});
tutors.get("/get-students-by-department", async (req, res) => {
  try {
    if (req.user._id === req.query.tutorId) {
      const students = await usersRecord.find({
        department: req.query.department,
      });
      return res.status(200).json(students);
    } else {
      return res.status(401).json("You are not authorized");
    }
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});

tutors.get("/select-class", async (req, res) => {
  try {
    if (req.user._id === req.query.tutorId) {
      const studentList = [];

      const module_mapping = await modulesMapping.find({
        moduleId: req.query.moduleCode,
      });
      for (const mapping of module_mapping) {
        studentList.push(mapping.userId);
      }
      const student_record = await usersRecord.find({
        _id: { $in: studentList },
      });
      return res.status(200).json(student_record);
    } else {
      return res.status(401).json("You are not authorized");
    }
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});

tutors.delete("/delete-class/", async (req, res) => {
  const { moduleId, tutorId } = req.query;
  try {
    if (req.user._id === tutorId) {
      const class_deleted = await modulesRecord.findOneAndDelete({
        _id: moduleId,
      });
      const deleted_attendance = await attendanceRecord.deleteMany({
        moduleId,
      });
      const deleted_mapping = await modulesMapping.deleteMany({ moduleId });

      return res.status(200).json("Successful");
    } else {
      return res.status(401).json("You are not authorized");
    }
  } catch (err) {
    res.status(500).json("Internal Server Error");
  }
});

tutors.post("/change-class-property", async (req, res) => {
  const { property, tutorId, moduleId } = req.body;

  //body requires Email of student and and _id of module and sends the added student

  try {
    if (req.user._id === tutorId) {
      if (property === true || property === false) {
        const currentModule = await modulesRecord.findOneAndUpdate(
          { _id: moduleId },
          { attendanceAllowed: property },
          { new: true }
        );

        return res.status(200).json(currentModule);
      } else {
        return res.status(400).json("The property sent is invalid");
      }
    } else {
      return res.status(401).json("You are not authorized");
    }
  } catch (err) {
    res.status(500).json("Internal server error");
  }
});

module.exports = tutors;
