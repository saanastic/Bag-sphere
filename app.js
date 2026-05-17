const express=require('express');
const app=express();
const path=require('path');
const http=require('http');
const ejs=require('ejs');
const cookieParser=require('cookie-parser');

const ownersrouter =require('./routes/owners-router');
const usersrouter =require('./routes/users-router');
const productsrouter =require('./routes/products-router');

const db=require('./config/mongoose-connection');

app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');

//routes
app.use('/owners',ownersrouter);
app.use('/users',usersrouter);
app.use('/products',productsrouter);


app.listen(3000);