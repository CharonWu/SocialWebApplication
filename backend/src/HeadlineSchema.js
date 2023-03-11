const mongoose = require('mongoose');

const headlineSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    headline: {
        type: String,
        required: [true, 'headline is required']
    }
})

module.exports = mongoose.model('Headline', headlineSchema);;;
