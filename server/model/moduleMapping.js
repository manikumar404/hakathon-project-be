const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    moduleId:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    key:{
        type:String,
        unique:true
    }
      
},
{timestamps:true}
)

const modulesMapping = mongoose.model('modulesMapping', schema);

module.exports = modulesMapping;