const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
// Load Course model
const Course = require('../models/Course');

router.get('/add',async (req,res)=>{
  if(req.isAuthenticated()){
    const courses = await Course.find();
    res.render("course",{
      courses
    })
  }else{
    res.redirect('/user/login')
  }
});

router.post('/add',async (req,res)=>{
  if(req.isAuthenticated()){
    const {courseId, courseTitle, courseDept, courseCredit, schedule, room} = req.body;
    const course = new Course({
      courseId,
      courseTitle,
      courseDept,
      courseCredit,
      schedule,
      room
    })
    await course.save();
    res.redirect('/courses/add');
  }
})

module.exports = router;
