const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullname: String,
    email: String,
    password: String,
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product',
    }],
    isadmin: Boolean,
    orders: [
        {
            products: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'product'
            }],
            totalAmount: Number,
            address: String,
            paymentMethod: {
                type: String,
                default: 'Card'
            },
            status: {
                type: String,
                default: 'Processing'
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    contact: Number,
    picture: String
});

module.exports = mongoose.model('user', userSchema);
