const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const mongojs = require("mongojs")
// Load User model
const User = require("../models/User");
const { forwardAuthenticated } = require("../config/auth");


var db = mongojs('mongodb://localhost:27017/advising', ['users'])
var ObjectId = mongojs.ObjectID;



router.get("/advising1", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("advising");
  } else {
    res.redirect("/users/login");
  }
});

// Login Page
router.get("/login", forwardAuthenticated, (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    res.render("login");
  }
});

// Register Page
router.get("/register", forwardAuthenticated, (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/dashboard");
  } else {
    res.render("register");
  }
});

// Register
router.post("/register", (req, res) => {
  const { name, email, stdId, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !stdId|| !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      stdId,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          stdId,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

//edit profile routes
// users/profile
router.get("/profile", (req, res) => {
  if(req.isAuthenticated()){
    res.render("profile",{
      userinfo:req.user
    });
  }
});

// router.get('/editprofile/:id', async(req,res)=>{
//   if(req.isAuthenticated()){
//       res.render("editprofile",{
//         userinfo:req.user
//       })
//     }else{
//       res.redirect('/users/login')
//     }
// })

//REAL CODE HERE

// router.put('/editprofile/',async (req,res)=>{
//   if(req.isAuthenticated()){
//     const { name, email, stdId, stdDept, stdPhone,stdCGPA } = req.body;
//     const newUser = new User({
//       name,
//       stdDept,
//       stdPhone,
//       stdCGPA
//     });
//     // var query = req.user;
//     // await User.findByIdAndUpdate(query, newUser);
//     await newUser.save();
//     res.redirect('/users/profile')
//   }
// })

// REAL CODE ENDS HERE
router.get('/editprofile/:id',(req,res)=>{
  User.findOne({
    _id: ObjectId(req.params.id)
  }, function(err, doc) {
    console.log(doc);
    res.render('editprofile',{
      userinfo : doc
    });
  })
  
});

router.post('/editprofile', (req, res) => {
  if(req.isAuthenticated()){
    updateRecord(req, res);
  }
});

function updateRecord(req, res) {
    const { name, email, stdId, stdDept, stdPhone,stdCGPA } = req.body;
    const newUser = new User({
      name,
      stdDept,
      stdPhone,
      stdCGPA
    });
    User.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true }, (err, doc) => {
      if (!err) { res.redirect('/users/profile')}
      
  });
}


// router.put('/editprofile/',(req, res)=>{
//   console.log(req.params.stdId)
  
//   const { name, email, stdId, stdDept, stdPhone,stdCGPA } = req.params;
//   var updatedInfo = {
//     name: req.params.name,
//     stdDept: req.params.stdDept,
//     stdPhone: req.params.stdPhone,
//     stdCGPA: req.params.stdCGPA,

//   }
//   User.findAndModify({
//     query: { _id: ObjectId(req.user._id) },
//     update: { $set: { updatedInfo } },
//     new: true
//   }, function (err, doc, lastErrorObject) {
//     if(err){
//       console.log(err);
//     }
//     res.redirect('/users/profile');
//   })
// });

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

module.exports = router;
