const express = require('express');
const ejsMate = require('ejs-mate')
const path = require('path');
const methodOverride = require('method-override')
const Wallet = require('./models/wallet')
const mongoose = require('mongoose');
const Budget = require('./models/budget');

main().catch((err) => console.log(err));
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/pennyplan");
    console.log("mongo connected!");
}

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));

app.get('/totalPrice',async(req,res) => {
    const wallets = await Wallet.find({});
    let totalPrice=0;
    for(let price of wallets) {
        if(price.transactionType == 'Credit') {
            totalPrice -= price.amount;
        } else {
            totalPrice += price.amount;
        }
    }
    res.json({price:totalPrice})
})

app.get('/home', async (req, res) => {
    const wallets = await Wallet.find({});
    const budgets = await Budget.find({});
    let totalPrice = 0;
    const credits= wallets.filter(price=> price.transactionType==='Credit');
    const debits= wallets.filter(price=> price.transactionType==='Debit');
    for(let price of wallets) {
        if(price.transactionType == 'Credit') {
            totalPrice -= price.amount;
        } else {
            totalPrice += price.amount;
        }
    }
    let budget = {};
    if(budgets.length > 0) {
        budget = budgets[budgets.length-1]
    } else {
        budget = {
            budget: 0,
        }
    }
    let size;
    if (wallets.length > 5) {
        size = 4;
    } else {
        size = wallets.length;
    }

    res.render("home", { wallets, size ,budget, totalPrice , credits , debits });
})

app.get('/', (req, res) => {
    res.render("landing");
})

app.get('/new', async (req, res) => {
    res.render("new");

})

app.post('/new', async (req, res) => {
    const transaction = new Wallet(req.body);
    await transaction.save();
    res.redirect('/new')
})

app.post('/budget', async(req,res) => {
    const budget = new Budget(req.body);
    await budget.save();
    res.redirect('/home')
})

app.get('/recents/viewAll',async(req,res) => {
    const wallets = await Wallet.find({});
    let end;
    if(wallets.length>36){
        end = wallets.length-36;
    }else{
        end = 0;
    }
    res.render("viewAll/recents",{wallets,end})
})

app.get('/credited/viewAll',async(req,res) => {
    const wallets = await Wallet.find({});
    const credits= wallets.filter(price=> price.transactionType==='Credit');
    let end;
    if(credits.length>36){
        end = credits.length-36;
    }else{
        end = 0;
    }
    res.render("viewAll/credited",{wallets, end, credits})
})

app.get('/debited/viewAll',async(req,res) => {
    const wallets = await Wallet.find({});
    const debits= wallets.filter(price=> price.transactionType==='Debit');
    let end;
    if(debits.length>36){
        end = debits.length-36;
    }else{
        end = 0;
    }
    res.render("viewAll/debited",{wallets , end, debits})
})

app.listen(3000, () => {
    console.log("Listening on port 3000")
})