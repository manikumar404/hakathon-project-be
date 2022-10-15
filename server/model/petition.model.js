const mongoose = require('mongoose');

var schema = new mongoose.Schema({
    title : {
        type : String,
        required: true,
    },
    description : {
        type: String,
        required: true,
    },
    image: String,
    category: String,
    goal: Number,
    user : {
        name: String,
        id: String,
        email: String,
        contact: String,
        cid: String,
        profile: String,
        location:{
            dzongkhag: String,
            geog: String,
        }
   },
    signatures: [
        {
            email: String,
            name: String,
            comments: String,
            addtrss: String,
            time: {
                type: String,
                default: new Date()
            },
        }
    ],
    comments:[
        {
            comment: String,
            rating: Number,
            time: {
                type: String,
                default: new Date()
            },
            user : {
                name: String,
                id: String,
                email: String,
                contact: String,
                cid: String,
                location:{
                    dzongkhag: String,
                    geog: String,
                },
            }
            
        }
    ]
},
{timestamps:true}
)

const Petition = mongoose.model('petition', schema);

module.exports = Petition;