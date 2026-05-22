const jwt=require('jsonwebtoken');
require('dotenv').config();
const userModel = require('../models/user-model');
const flash=require('connect-flash');   

module.exports.isloggedin= async (req,res,next)=>{
    if(!req.cookies.token){
        req.flash('error','You must be logged in to access this resource');
        return res.redirect('/login');
    }
    else{
        try {
            const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);

            let user=await userModel.findOne({email:decoded.email})
            .select('-password');
            req.user = user;
           
            next();

        } catch (error) {
            req.flash('error','Invalid or expired token');
            return res.redirect('/login');
        }
    }
}