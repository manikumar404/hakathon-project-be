const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyparser = require("body-parser");
const cors = require("cors");
dotenv.config({ path: "./config.env" });

//const router = require('./server/routes/router.js')
const auth = require("./server/routes/auth.js");
const admin = require("./server/routes/admin.js");
const common = require("./server/routes/common.js");
const commonUsers = require("./server/routes/commonUsers.js");
const test = require("./server/routes/test.js");

const connectDB = require("./server/database/connection");

const path = require("path");
const verify = require("./server/services/verify.js");
const res = require("express/lib/response");
const PORT = process.env.PORT || 8080;
//const URI = 'mongodb+srv://mani:mani123@cluster0.xycbo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
connectDB();
app.use(bodyparser.urlencoded({ extended: true }));
app.use("/css", express.static(path.resolve(__dirname, "assets/css")));

app.set("view engine", "ejs");
app.use("/auth", auth);
app.use(
  "/admin",
  verify,
  (req, res, next) => {
    
    if (req.user.userType === "admin") {
      next();
    } else {
      return res.status(401).json("you dont have access!");
    }
  },
  admin
);
app.use("/common", verify, common);
app.use(
  "/commonUsers",
  verify,
  commonUsers
);
app.use("/test", test);

app.listen(PORT, () => console.log(`server running at ${PORT}`));
