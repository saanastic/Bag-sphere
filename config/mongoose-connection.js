const mongoose=require('mongoose');
const config=require('config');


mongoose.connect(`${config.get('MONGO_URI')}/BagSphere`).then(

    ()=>
    {
        console.log('Connected to MongoDB');
    }
).catch((err)=>{
    console.log(err);
});

module.exports=mongoose.connection;