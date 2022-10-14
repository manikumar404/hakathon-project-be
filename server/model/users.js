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
    },
     password : {
         type:String,
         required:true
    },
    followers: [
        {
            userId: {
                type: String,
                required: true
            },
            name: String
        }
    ],
    following: [{
        userId: {
            type: String,
            required: true
        },
        name: String
    }],
    profile: String,
    bio: String,
    occupation: String,
    userType:{
        type:String,
        enum : ['User','Admin'],
        default: 'User'
        
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