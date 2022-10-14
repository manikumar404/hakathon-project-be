const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    message : {
        type : String,
        required: true
    },
    
},
{timestamps:true}
)

const Chats= mongoose.model('Chats', schema);

module.exports = Chats