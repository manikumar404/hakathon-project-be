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

const Post = mongoose.model('Post', schema);

module.exports = Post;