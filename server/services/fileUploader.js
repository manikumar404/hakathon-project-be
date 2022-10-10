
const multer = require("multer")
const path = require('path');

var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null,path.resolve('./')+'/uploads/');  },
    filename: (req, file, cb) => {
      var filetype = '';
      if(file.mimetype === 'image/gif') {
        filetype = 'gif';
      }
      if(file.mimetype === 'image/png') {
        filetype = 'png';
      }
      if(file.mimetype === 'image/jpeg') {
        filetype = 'jpg';
      }
      cb(null, 'image-' + Date.now() + '.' + filetype);
    }
  });
  
  var upload = multer({storage: storage});
  
  module.exports = upload