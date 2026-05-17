const mongoose=require('mongoose');


const ownerSchema=new mongoose.Schema({
    fullname:String,
    email:String,
    password:String,
    products:{
        type:Array,
        default:[] 
    },
    contact:Number,
    picture:String,
    gstint :String, 

});
module.exports=mongoose.model('owner',ownerSchema);