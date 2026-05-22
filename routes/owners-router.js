const express=require('express');
const router=express.Router();
const Ownermodel=require('../models/owner-model');
const dotenv=require('dotenv');
const productModel = require('../models/product-model');
dotenv.config();

router.get('/',(req,res)=>{
    res.send('Owners Router');
});
console.log(process.env.NODE_ENV);
if(process.env.NODE_ENV==='development') {
    router.post('/create',async (req,res)=>{
        let owners=await Ownermodel.find();
        if(owners.length>0){
            res.status(400).json({message: 'Owner already exists'});
        } else {
           let {fullname,email,password}=req.body;
           let newowner= Ownermodel.create({fullname,email,password});
           res.status(200).send('Owner created successfully');
        }
    });
}



router.get('/admin',async (req,res)=>{
   let success = req.flash('success','Product created successfully');
   let products=await productModel.find();
   res.render('createproducts',{success, products});
});
module.exports=router;