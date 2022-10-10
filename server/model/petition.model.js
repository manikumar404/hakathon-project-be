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
    signatures: [
        {
            email: String
        }
    ],
    comments:[
        {
            comment: String,
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