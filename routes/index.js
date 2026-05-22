const express=require('express');
const router=express.Router();
const { isloggedin } = require('../middlewares/isloggedin');
const productModel=require('../models/product-model');
const userModel=require('../models/user-model');
const { logoutuser } = require('../controllers/logoutcontroller');

router.get('/',(req,res)=>{
    res.render('index', { error: "",loggedin:false});
});

router.get('/shop', isloggedin, async (req, res) => {
    let { sortby, filter } = req.query;

    let query = {};
    let sortOption = {};

    // Filter logic
    if (filter === 'discounted') {
        query.discount = { $gt: 0 };
    } else if (filter === 'new') {
        // no query filter, just sort by newest
    }

    // Sort logic
    if (sortby === 'newest' || filter === 'new') {
        sortOption = { _id: -1 };
    } else {
        sortOption = { _id: 1 }; // default: oldest first = "popular"
    }

    let products = await productModel.find(query).sort(sortOption);

    // Limit to 8 for "new collection"
    if (filter === 'new') {
        products = products.slice(0, 8);
    }

    let success = req.flash('success');
    res.render('shop', { products, success, sortby: sortby || 'popular', filter: filter || '' });
});

router.get("/cart", isloggedin,async (req,res)=>{
    let user=await userModel.findOne({email:req.user.email}).populate('cart');
    res.render('cart',{user});
});

// Add to index.js
router.get('/removefromcart/:productid', isloggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    let index = user.cart.indexOf(req.params.productid);
    if (index > -1) user.cart.splice(index, 1);
    await user.save();
    res.redirect('/cart');
});

 router.get('/addtocart/:productid', isloggedin,async (req,res)=>{
     let user=await userModel.findOne({email:req.user.email});
      user.cart.push(req.params.productid); await user.save(); res.redirect('/shop'); });


      // ── CHECKOUT ──────────────────────────────────────────────
router.get('/checkout', isloggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email }).populate('cart');
    if (user.cart.length === 0) return res.redirect('/cart');

    let total = 0;
    user.cart.forEach(p => {
        total += p.discount > 0 ? p.price - p.discount : p.price;
    });

    res.render('checkout', { user, total, finalAmount: total + 20 });
});
 
// ── PAYMENT PAGE (after checkout form submit) ─────────────
router.post('/gotopayment', isloggedin, async (req, res) => {
    let { address } = req.body;
    if (!address || address.trim() === '') return res.redirect('/checkout');

    let user = await userModel.findOne({ email: req.user.email }).populate('cart');

    let subtotal = 0;
    user.cart.forEach(p => {
        subtotal += p.discount > 0 ? p.price - p.discount : p.price;
    });

    let finalAmount = subtotal + 20;

    res.render('payment', {
        address: address.trim(),
        orderItems: user.cart,
        subtotal,
        finalAmount
    });
});
 
// ── PLACE ORDER (after payment form submit) ───────────────
router.post('/placeorder', isloggedin, async (req, res) => {
    let { address, paymentMethod } = req.body;

    let user = await userModel.findOne({ email: req.user.email }).populate('cart');

    let total = 0;
    user.cart.forEach(p => {
        total += p.discount > 0 ? p.price - p.discount : p.price;
    });

    let finalAmount = total + 20;

    user.orders.push({
        products: user.cart.map(p => p._id),
        totalAmount: finalAmount,
        address,
        paymentMethod: paymentMethod || 'Card',
        status: 'Processing'
    });

    user.cart = [];
    await user.save();

    res.redirect('/paymentsuccess');
});
// ── ORDER CONFIRMED ───────────────────────────────────────
router.get('/orderconfirmed', isloggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    let lastOrder = user.orders[user.orders.length - 1];
    res.render('orderconfirmed', { order: lastOrder });
});
 router.get('/paymentsuccess', isloggedin, async (req, res) => {
    let user = await userModel.findOne({ email: req.user.email });
    let lastOrder = user.orders[user.orders.length - 1];
    res.render('paymentsuccess', { order: lastOrder });
});

router.get('/logout', logoutuser);




module.exports=router;