const mongoose = require('mongoose');

const followingSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    following:{
        type: [],
        required: [true, 'comments is required']
    }
})

module.exports = mongoose.model('Following', followingSchema);;
