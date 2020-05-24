
   const mongoose = require('mongoose');
   
   var demographic = new mongoose.Schema({
    pcode:Number,
    name:String,
    email:String,
    age :String,
    race:[],
    gender:String,  
    chronicPain:String,
    paincPeriod:String,
    degree:String,
    employment:String,
    date:Date,
   });
   
   mongoose.model('Demographic', demographic);