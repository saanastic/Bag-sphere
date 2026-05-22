const userModel = require('../models/user-model');
const bcrypt = require('bcrypt');
require('dotenv').config();
const jwt=require('jsonwebtoken');
const { generateToken } = require('../utils/generatetoken');

module.exports.registeruser=async (req,res)=>{
    try {

        let { fullname, email, password } = req.body;

        let checkUser = await userModel.findOne({ email    });

        if (checkUser) {
            return res.status(400).send('User with this email already exists');
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await userModel.create({
            fullname,
            email,
            password: hashedPassword
        });
        console.log(hashedPassword);

        let token= generateToken(newUser);
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        res.status(201).send({ message: 'User registered successfully', token });

    } catch (err) {

        console.log(err);

        res.status(500).send('Something went wrong');
    }
}