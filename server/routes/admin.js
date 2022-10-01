const express = require("express");

const bcrypt = require("bcrypt");
const verify = require("../services/verify");
const passwordValidator = require("../validators/passwordValidator");
const adminPasswordReset = require("../validators/adminPasswordReset");
const admin = express.Router();

// admin.delete("/delete-account/", verify, async (req, res) => {
//   try {
//     const userId = req.query;
//     const deleted_user = await usersRecord.findOneAndDelete({ _id: userId });
//     const deleted_module = await modulesRecord.deleteMany({ tutorId: userId });
//     const deleted_map = await modulesMapping.deleteMany({ userId });
//     const delete_attendance = await attendanceRecord.deleteMany({
//       tutorId: userId,
//     });
//     res.status(200).json("successful");
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// admin.delete("/delete-class/", async (req, res) => {
//   try {
//     const { moduleId } = req.query;

//     const deleted_module = await modulesRecord.findOneAndDelete({
//       _id: moduleId,
//     });
//     const deleted_map = await modulesMapping.deleteMany({ moduleId });
//     const delete_attendance = await attendanceRecord.deleteMany({ moduleId });
//     res.status(200).json("successful");
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// admin.get("/all-classes/", async (req, res) => {
//   try {
//     const classes = await modulesRecord.find();
//     res.status(200).json(classes);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// admin.get("/all-students/", async (req, res) => {
//   try {
//     const all = await usersRecord.find({ userType: "student" });
//     res.status(200).json(all);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });
// admin.get("/all-tutors/", async (req, res) => {
//   try {
//     const all = await usersRecord.find({ userType: "tutor" });
//     res.status(200).json(all);
//   } catch (err) {
//     res.status(500).json("internal server error");
//   }
// });

// admin.post("/create-students-token/", async (req, res) => {
//   try {
//     const token = await currentState.findOne({
//       propertyName: "Students-Token",
//     });
//     if (!token) {
//       const newToken = new currentState({
//         propertyName: "Students-Token",
//         value: req.body.token,
//       });
//       const saved = await newToken.save();
//       return res.status(200).json(saved);
//     } else {
//       const token = await currentState.findOneAndUpdate(
//         { propertyName: "Students-Token" },
//         { value: req.body.token },
//         { new: true }
//       );
//       return res.status(200).json(token);
//     }
//   } catch (err) {
//     res.status(500).json("Inter server error");
//   }
// });

// admin.post("/create-tutors-token/", async (req, res) => {
//   try {
//     const token = await currentState.findOne({ propertyName: "Tutors-Token" });
//     if (!token) {
//       const newToken = new currentState({
//         propertyName: "Tutors-Token",
//         value: req.body.token,
//       });
//       const saved = await newToken.save();
//       return res.status(200).json(saved);
//     } else {
//       const token = await currentState.findOneAndUpdate(
//         { propertyName: "Tutors-Token" },
//         { value: req.body.token },
//         { new: true }
//       );
//       return res.status(200).json(token);
//     }
//   } catch (err) {
//     res.status(500).json("Inter server error");
//   }
// });

// admin.get("/tokens/", async (req, res) => {
//   try {
//     const token = await currentState.find();
//     res.status(200).json(token);
//   } catch (err) {
//     res.status(500).json("Internal server error");
//   }
// });
// admin.delete("/tokens/", async (req, res) => {
//   try {
//     const token = await currentState.deleteMany({});
//     res.status(200).json("Successful ");
//   } catch (err) {
//     res.status(500).json("Internal server error");
//   }
// });

// admin.post("/update-password", async (req, res) => {
//   try {
//     const { error } = adminPasswordReset.validate(req.body);
//     if (error) return res.status(400).json(error.details[0].message);

//     const salt = await bcrypt.genSalt(10);

//     const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

//     const updated = await usersRecord.findOneAndUpdate(
//       { email: req.body.email },
//       { password: hashedPassword }
//     );
//     if (!updated) return res.status(401).json("Could not update");

//     return res.status(200).json("Successful");
//   } catch (err) {
//     res.status(500).json("Internal server error");
//   }
// });

module.exports = admin;
