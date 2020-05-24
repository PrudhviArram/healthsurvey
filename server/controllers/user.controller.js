const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const User = mongoose.model('User');
const demographicSchema = mongoose.model('Demographic')
const PainScale = mongoose.model('PainScale');


var pdf = require('html-pdf')
var html = 'somehtmlfile.html'


function bufferToStream(buffer) {  
    let stream = new Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
  }

module.exports.upload = (req, res,next) =>{
    console.log(req.body);
    res.status(202).send(['Duplicate email adrress found.']);
}







module.exports.register = (req, res, next) => {
    var user = new User();
    user.participantCode = req.body.participantCode;
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user)
        {
            return res.status(200).json({ "token": user.generateJwt() ,"user": user.participantCode});}
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.userProfile = (req, res, next) =>{
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['participantCode','fullName','email']) });
        }
    );
}

module.exports.saveDemographicDetails = (req,res,next) =>{
        var demographic = new demographicSchema();
        demographic.email = req.body.email;
        demographic.age = req.body.age;
        demographic.race = req.body.race;
        demographic.gender = req.body.gender;
        demographic.chronicPain = req.body.chronicPain;
        demographic.paincPeriod = req.body.paincPeriod;
        demographic.degree = req.body.degree;
        demographic.employment = req.body.employment;
        demographic.date = req.body.date;
        demographic.save((err, doc) => {
            if (!err)
                res.send(doc);
            else {
                if (err.code == 11000)
                    res.status(422).send(['Duplicate email adrress found.']);
                else
                    return next(err);
            }
    
        });
}

module.exports.findDemographic = (req, res, next) =>{
    demographicSchema.findOne({ email: req.query.email },
        (err, user) => {
            if (!user){
                
                return res.status(200).json({ status: true, message: 'User record not found.' });}
            else
                return res.status(200).json({ status: true, message: 'User record found' });
        }
    );
}
module.exports.findForm = (req, res, next) =>{
    PainScale.findOne({ emailId: req.query.email }).sort({date:-1}).exec(
        (err, user) => {
            
            if (!user){
                
                return res.status(200).json({ status: true, message: 'form not found.' });}
            else
                return res.status(200).json({ status: true, message:'User record found',user : _.pick(user,['_id','date','feedback']) });
        }
    );
}

module.exports.getCount = (req, res, next) =>{
    PainScale.findOne({ emailId: req.query.email }).count(
        (err, count) => {
            if (!err){
                
                return res.status(200).json({ status: true, message: count });}
            else
                return res.status(200).json({ status: false, message: 'error' });
        });
}


module.exports.getMemories = (req, res, next) =>{
    User.findOne({ email: req.query.email },
        (err, user) => {
            
            if (!user){
                
                return res.status(200).json({ status: true, message: 'form not found.' });}
            else
                return res.status(200).json({ status: true, message:'User record found',user : _.pick(user,['userStories']) });
        }
    );
}


module.exports.savePainScale = (req,res,next) =>{
    var pain= new PainScale();
    pain.pcode = req.body.pcode;
    pain.name = req.body.name;
    pain.emailId = req.body.emailId;
    pain.painScale = req.body.painScale;
    pain.date = req.body.date;
    pain.ruminationScale =req.body.ruminationScale;
    pain.controlScale = req.body.controlScale;
    pain.save((err, doc) => { 
        if (!err)
            res.status(200).send(['painscale saved']);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
    
}

//admin service
module.exports.getAllUsers = (req, res, next) =>{
    User.find({},
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user });
        }
    );
}

module.exports.getAllDemographic = (req, res, next) =>{
    demographicSchema.find({},
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user });
        }
    );
}
module.exports.getAllSurvey = (req, res, next) =>{
    PainScale.find({ },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true,user });
        }
    );
}
module.exports.addStrories = (req, res, next) =>{
    
    User.findOneAndUpdate({email:req.body.params.email},{$set:{userStories:req.body.params.story}},{new: true},
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true,message:" Updated Successfully",user });
        }
    );
}

module.exports.submitFeedback = (req, res, next) =>{
    
    PainScale.findOneAndUpdate({_id:req.body.params.id},{$set:{feedback:req.body.params.feedback}},{new: true},
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true,message:" Updated Successfully",user });
        }
    );
}