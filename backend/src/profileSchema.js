const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    email:{
        type: String
    },
    zipcode:{
        type: String
    },
    dob:{
        type:Date
    }
})

module.exports = mongoose.model('Profile', profileSchema);;
