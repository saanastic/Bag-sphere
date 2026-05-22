const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt=require('jsonwebtoken');
const { generateToken } = require('../utils/generatetoken');

module.exports.loginuser=async (req,res)=>{
    let { email, password } = req.body;
    try {

        let user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).send('Invalid email or password');
        }
        else{
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).send('Invalid email or password');
            }
            else{
                let token= generateToken(user);
                res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                return res.status(200).redirect('/shop');
            }
        }

    

    } catch (error) {
        console.error(error);
        return res.status(500).send('Internal server error');
    }
};