const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    gender : {
        type: String,
        enum : ['Male','Female','Others'],
        required: true,
       
    },
    
     password : {
         type:String,
         required:true
    },
    userType:{
        type:String,
        enum : ['student','tutor','admin'],
        default: 'student'
        
    },
   department:{
       type:String,
       required:true
   }
      
},
{timestamps:true}
)

const usersRecord = mongoose.model('usersRecord', schema);

module.exports = usersRecord;