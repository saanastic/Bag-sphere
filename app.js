const express=require('express');
const app=express();
const path=require('path');
const http=require('http');
const ejs=require('ejs');
const cookieParser=require('cookie-parser');
const flash=require('connect-flash');
const session=require('express-session');

const indexrouter = require('./routes/index');
const ownersrouter =require('./routes/owners-router');
const usersrouter =require('./routes/users-router');
const productsrouter =require('./routes/products-router');

require('dotenv').config();

const db=require('./config/mongoose-connection');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

app.use(cookieParser());
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');

//routes
app.use('/', indexrouter);
app.use('/owners',ownersrouter);
app.use('/users',usersrouter);
app.use('/products',productsrouter);


app.listen(3000);