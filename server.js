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
const commonUsersEndorsement = require("./server/routes/endorsment/commonUsers.js");
const publicUsersEndorsement = require("./server/routes/endorsment/public.route.js");
const commonUsersPetition = require("./server/routes/petition/commonUsers.js");
const publicUsersPetition = require("./server/routes/petition/public.route.js");
const commonUsersPost = require("./server/routes/post/commonUsers.js");
const publicUsersPost = require("./server/routes/post/public.route.js");

const test = require("./server/routes/test.js");

const connectDB = require("./server/database/connection");

const path = require("path");
const verify = require("./server/services/verify.js");
const res = require("express/lib/response");
const PORT = process.env.PORT || 8080;
const app = express();

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
connectDB();
app.use(bodyparser.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));


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
app.use("/common",common);
app.use(
  "/endorsments",
  verify,
  commonUsersEndorsement
);

app.use(
  "/public-endorsments",
  publicUsersEndorsement
);


app.use(
  "/public-petitions",
  publicUsersPetition
);
app.use(
  "/petitions",
  verify,
  commonUsersPetition
);

app.use(
  "/public-posts",
  publicUsersPost
);
app.use(
  "/posts",
  verify,
  commonUsersPost
);

app.listen(PORT, () => console.log(`server running at ${PORT}`));
