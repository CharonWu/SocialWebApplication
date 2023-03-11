const mongoose = require('mongoose');

const googleUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    googleId: {
        type: String,
        required: [true, 'Username is required']
    },
    token: {
        type: String,
        required: [true, 'token is required']
    }
})

module.exports = mongoose.model('GoogleUser', googleUserSchema);;
