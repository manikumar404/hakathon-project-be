const { boolean } = require('joi');
const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    moduleName : {
        type : String,
        required: true,
        unique:true
    },
    moduleCode : {
        type: String,
        required: true,
        unique: true
    },
    tutorId : {
        type:String,
        required:true
   },
   attendanceAllowed:Boolean,
    
      
},
{timestamps:true}
)

const modulesRecord = mongoose.model('modulesRecord', schema);

module.exports = modulesRecord;