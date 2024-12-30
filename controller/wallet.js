const Wallet = require('..models/wallet');

module.exports.createWallet = async(req,res) => {
    const wallet = new Wallet(req.body);
    await wallet.save();
}