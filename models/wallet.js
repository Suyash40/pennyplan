const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const wallet = new Schema({
    transactionType:{
        type:String,
        enum:['Credit','Debit']
    },
    category:{
        type:String,
        enum:['Travel','Food','Medical','Shoping','Rent','Miscellaneous'],
        required:true
    },
    title:{
        type:String
    },
    date:{
        type:Number
    },
    amount:{
        type:Number,
        required:true
    },
});

module.exports = mongoose.model('Wallet',wallet)