const mongoose = require('mongoose');

const Courses = new mongoose.Schema({
    courseId: {
        type:String,
    },    
    courseTitle: {
        type:String,
    },
    courseDept: {
        type:String,
    },
    courseCredit: {
        type:Number,
        
    },
    schedule:{
        type:String,
    },
    room:{
        type:String,
    }
});

const User = mongoose.model('Course', Courses);

module.exports = User;
