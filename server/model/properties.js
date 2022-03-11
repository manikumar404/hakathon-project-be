const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    propertyName:{
        type:String,
        enum : ['Tutors-Token','Students-token'],
        required: true,
    },
    value:{
        type:String,
        required:true
    }
},
{timestamps:true}
)


const currentState = mongoose.model('currentState', schema);

module.exports = currentState;