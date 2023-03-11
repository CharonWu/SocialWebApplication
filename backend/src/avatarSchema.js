const mongoose = require('mongoose');

const avatarSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    avatar: {
        type: String,
        required: [true, 'avatar is required']
    }
})

module.exports = mongoose.model('Avatar', avatarSchema);;
