const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    status : {
        type:String,
        enum : ['P','A'],
        default : 'P'
    },
   
   moduleId:{
       type:String,
       required:true
   },
   studentId:{
       type:String,
       required:true

   },
   tutorId:{
       type:String,
       required:true
   }
      
},
{timestamps:true}
)

const attendanceRecord = mongoose.model('attendanceRecord', schema);

module.exports = attendanceRecord;