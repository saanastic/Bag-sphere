const express=require('express');
const router=express.Router();
const upload=require('../config/multer-config');
const multer=require('multer');
const productModel=require('../models/product-model');

router.post('/create-product',upload.single('image'),  async (req,res)=>{
    try {

        const product = await productModel.create({

            image: req.file.buffer,

            name: req.body.name,

            price: req.body.price,

            discount: req.body.discount,

            bgcolor: req.body.bgcolor,

            panelcolor: req.body.panelcolor,

            textcolor: req.body.textcolor
        });
        req.flash('success', 'Product created successfully');

        res.redirect('/owners/admin');

    } catch (error) {

        console.log(error);

        res.send(error.message);
    }
});

module.exports=router;