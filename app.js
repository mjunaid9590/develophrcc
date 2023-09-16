const express = require("express");
const app = express();
// const db = require("./src/database/db")
// const user= require("./backend/src/routes/user");
// const admin = require("./backend/src/routes/admin")
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors")
const cookieParser = require("cookie-parser")
const uploads = require("./middlewear/upload")
const jsonUpload = require("./middlewear/uploadJosn")
// routes
const authRoute = require("./routes/authRoute")
const jobRoute = require("./routes/jobRoute")
const userRoute = require("./routes/userRoute")
const publicRoute = require("./routes/publicRoute")
app.use(cors())

dotenv.config()
const mongoose = require("mongoose");
const { authenticateUser } = require("./middlewear/authMiddlewear");
const JobModel = require("./model/JobModel");
const UserModel = require("./model/UserModel");
// const dbUrl = process.env.DBURL;


// const mongoose = require("mongoose");
// mongoose.connect('mongodb://127.0.0.1:27017/myapp').then(()=>{
//     console.log("connected")
// });
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(cookieParser());

// app.use("/", user)
// app.use("/admin",admin)
app.use("/api/v1/auth", authRoute)
app.use("/api/v1/jobs",authenticateUser, jobRoute)
app.use("/api/v1/users", authenticateUser, userRoute)
app.use("/uploads", express.static(path.join(__dirname, "./uploads")))




// other route
app.post("/new/job", authenticateUser, uploads.fields([
    { name: 'visa', maxCount: 1 },
    { name: 'passport', maxCount: 1 },
    { name: 'ticket', maxCount: 1 },
    { name: 'protector', maxCount: 1 },
  ]), async (req, res) => {
    try {
      req.body.createdBy = req.user.userId;
      req.body.protector = req.files["protector"][0].filename;
      req.body.passport = req.files["passport"][0].filename;
      req.body.visa = req.files["visa"][0].filename;
      req.body.ticket = req.files["ticket"][0].filename;
      const job = new JobModel(req.body);
      try {
        job.save().then(response => {
          if (response) {
            return res.send({ done: true, data: job });
          } else {
            return res.status(400).json({ message: "fial" });
          }
        })
      } catch (err) {
        console.log(err)
        res.send({done:false, message:"There is database error. Please try again."})
      }
    } catch (err) {
      console.log(err)
      res.send({ done: false, message: "server Problem" })
    }
  });
  
  // it get the data from the database and send to frontend
app.get("/all/data", authenticateUser, async (req, res) => {
    try {
      let JobData = await JobModel.find({});
      let UserData = await UserModel.find({});
      if (JobData && UserData) {
        res.send(JSON.stringify({ Job: JobData, User: UserData }, null, 2))
      } else {
        res.send({ done: false })
      }
  
    } catch (err) {
      console.log(err)
      res.send({ done: false, Error: true })
    }
  })
  
  // it get data from frontend json file and store in db 
  app.post("/data/read", authenticateUser, jsonUpload, async (req, res) => {
    try {
      const jsonFile = req.file;
      if (!jsonFile)
        return res.send({ done: false, message: "The file is required" });
  
      const jsonData = JSON.parse(jsonFile.buffer.toString('utf8'));
      
      // Create arrays to hold the found data
      const jobData = [];
      const userData = [];
      
      for (const job of jsonData.Job) {
        const foundJob = await JobModel.findOne({ _id: job._id });
        if (!foundJob) {
          // If not found, add the job data to the array
          jobData.push(job);
        }
      }
      
      for (const user of jsonData.User) {
        const foundUser = await UserModel.findOne({ _id: user._id });
        if (!foundUser) {
          // If not found, add the user data to the array
          userData.push(user);
        }
      }
  
      // Insert the new data into the database
      if (jobData.length > 0) {
        await JobModel.insertMany(jobData, { ordered: false });
      }
  
      if (userData.length > 0) {
        await UserModel.insertMany(userData, { ordered: false });
      }
  
      res.send({ done: true, message: "Done successfully." });
    } catch (error) {
      console.error('Error importing data:', error);
      res.send({ done: false, message: "There is some error in importing data. Please try again." });
    }
  });
  
  // it cant need authentication
  app.get("/get/job/", async (req, res) => {
    let id = req.query.id;
    // if (id) {
      let jobData = await JobModel.findOne({ _id: id })
     return res.send({ done: true, data: jobData })
     
    // }
    // res.status(404).send({done:false, data:"There is no data on this id. Please try again"})
  })

  
app.use(express.static(path.join(__dirname, 'Client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'Client/build/index.html'));
})

const Port = process.env.PORT || 500;
mongoose.connect(process.env.MONGO_URL).then(()=>{console.log("connected")}).catch(err=>console.log(err));
app.listen(Port, ()=>{
    console.log("server run on 500")
})