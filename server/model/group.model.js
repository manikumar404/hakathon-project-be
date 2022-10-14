const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    adminId : {
        type: String,
        required: true,
    },
    members: [
        {
            userId: String,
            name: String,
        }
    ],
    posts: [
        {
            title: String,
            description: String,
            user: String,
            image: String,
            time: {
                type: String,
                default: new Date()
            }

        }
    ]
    
},
{timestamps:true}
)

const Groups= mongoose.model('Groups', schema);

module.exports = Groups