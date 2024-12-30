const express = require('express');
const router = express.Router();

const Wallet = require('./models/wallet')

router.route('/home')
    .get()

router.route('/new')
    .get()
    .post()