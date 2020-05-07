const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load User model
const Advising = require("../models/Advising");
const user = require("../models/User")
const course = require("../models/Course")
// app.get('/',(req,res)=>{
//     db.users.find((err,docs)=>{
//         //console.log(docs);
//         res.render('index',{
//           title : 'customer',
//           users: docs
//         });
//     })
//     //var title  = 'customers';
// })

// advising
router.get("/advising", async (req, res) => {
  if (req.isAuthenticated()) {
    const courses = await course.find();
    const advisings = await Advising.find();
    res.render("advising",{
      courses,
      user:req.user,
      advisings
    });
  } else {
    res.redirect("/users/login");
  }
});

router.post("/advising", async (req, res) => {
  if(req.isAuthenticated()){
    const {userID, courseID} = req.body;
    const advising = new Advising({
      userID,
      courseID
    })
    await advising.save();
    res.redirect('/advising');
  }else {
    res.redirect("/users/login");
  }
});

router.get("/schedule/:courseID", async (req, res) => {
  if (req.isAuthenticated()) {
    const courseID = req.params.courseID;
    const courses = await course.find({courseID});
    
    res.render("schedule",{
      courses
    });
  } else {
    res.redirect("/users/login");
  }
});


module.exports = router