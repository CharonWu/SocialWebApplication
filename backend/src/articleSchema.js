const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    author: {
        type: String,
        required: [true, 'Username is required']
    },
    pid:{
        type: Number,
        required: [true, 'id is required']
    },
    text:{
        type: String,
        required: [true, 'content is required']
    },
    comments:{
        type: [],
        required: [true, 'comments is required']
    },
    image:{
        type: String
    },
    date: {
        type: Date,
        required: [true, 'Created date is required']
    }
})

module.exports = mongoose.model('Article', articleSchema);
