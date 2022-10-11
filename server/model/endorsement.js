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
    goal: Number,
    roleTitle: String,
    category: String,
    roleDescription: String,
    user : {
        name: String,
        id: String,
        email: String,
        contact: String,
        cid: String,
        location:{
            dzongkhag: String,
            geog: String,
        }
   },
   endorse: [
    {
        email: String,
        comment: String,
    }
   ],
   
    comments:[
        {
            comment: String,
            rating: Number,
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

const Endorsement = mongoose.model('Endorsement', schema);

module.exports = Endorsement;