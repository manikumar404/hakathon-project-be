const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    email : {
        type: String,
        required: true,
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
        enum : ['User','Admin'],
        default: 'user'
        
    },
    contact: String,
    cid: String,
    location:{
        dzongkhag: String,
        geog: String,
    }
},
{timestamps:true}
)

const Users = mongoose.model('Users', schema);

module.exports = Users;