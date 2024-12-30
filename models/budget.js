const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const budget = new Schema({
    budget:{
        type:Number,
    }
})

module.exports = mongoose.model('Budget',budget)