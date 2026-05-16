const express=require('express');
const app=express();
const path=require('path');
const http=require('http');
const ejs=require('ejs');
const cookieParser=require('cookie-parser');

const owners-router=require('./routes/owners-router');
const users-router=require('./routes/users-router');
const products-router=require('./routes/products-router');

const db=require('./config/mongoose-connection');

app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');

//routes
app.use('/owners',owners-router);
app.use('/users',users-router);
app.use('/products',products-router);


app.listen(3000);