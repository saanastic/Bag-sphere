const express=require('express');
const router=express.Router();
const { registeruser } = require('../controllers/authcontroller');
const { loginuser } = require('../controllers/logincontroller');




router.get('/',(req,res)=>{
    res.send('users Router');
});

router.post('/register',registeruser);

router.post('/login',loginuser);


module.exports=router;