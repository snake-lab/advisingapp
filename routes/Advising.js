const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load User model
const Advising = require("../models/Advising");

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
router.get("/advising1", (req, res) => {
  // if (req.isAuthenticated()) {
  //   res.render("advising");
  // } else {
  //   res.redirect("/users/login");
  // }

  res.render("advising");
});

router.get("/advising", async (req, res) => {
  const courselist = await Advising.find();

  res.render("advising", {
    courselist,
  });
});

router.post("/advise", (req, res) => {
  const { userID, courseID } = req.body;
  if (!userID || !courseID) {
    errors.push({ msg: "Please enter all fields" });
  }
  if (errors.length > 0) {
    const advising = new Advising({
      userID,
      courseID,
    });
    advising
      .save()
      .then((user) => {
        req.flash("success_msg", "You registered 2 courses");
        res.redirect("/users/dashboard");
      })
      .catch((err) => console.log(err));
  }
});
