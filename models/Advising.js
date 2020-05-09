const mongoose = require("mongoose");

const Advising = new mongoose.Schema({
  userID: {
    type: String,
  },
  courseID: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("advising", Advising);

module.exports = User;

// const Advising = mongoose.model("advising", Advising);
// module.exports = Advising;
