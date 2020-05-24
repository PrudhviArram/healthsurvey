const mongoose = require('mongoose');
   
var painscale = new mongoose.Schema({
 
    pcode:Number,
    name:String,
    emailId:String,
    painScale:{
        type:Array,
        "default":[]
    },
    date :Date,
    ruminationScale:{
        type:Array,
        "default":[]
    },
    controlScale:{
        type:Array,
        "default":[]
    },
    feedback:String
});

mongoose.model('PainScale', painscale);