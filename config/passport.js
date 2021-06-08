const LocalStrategy = require('passport-local').Strategy;
const User=require('../models/signup')

module.exports=function(passport){
    passport.use(new LocalStrategy({usernameField:'username'},(username,password,done)=>{
        User.findOne({username:username})
        .then(user=>{
            if(!user){
                done(null, false,{message:'email not registered'})
            }
            var dbpassword=user.password
            if(dbpassword==password){
                console.log("Login successfull !")
                return done(null,user,{message:"Logged in successfully !"})
            }
            else{
                console.log('Please check again !')
                return done('Validation failed', false,{message:"Password incorrect"})
            }
        })
        .catch(err=>console.log(err))
    }))
    passport.serializeUser(function(user, done) {
        console.log('serialize')
        done(null, user.email);
      });
    
    passport.deserializeUser(function(id, done) {
        console.log('deserialize')
    
        User.findOne({email}).lean().exec((err,user)=>{
            done(err,user)
        })
        
    });
}