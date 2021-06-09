// const { request } = require("express");
// const bcryptjs =require('bcryptjs')
const express = require('express')
const nodemailer=require("nodemailer")
const mailgun =require("nodemailer-mailgun-transport")
const router = express.Router()
const jwt=require('jsonwebtoken')
// const httpProxy = require('http-proxy');
const {requireSignin}=require('../middleware')
// const proxy = httpProxy.createServer({});
// const passport=require('passport')
const {promisify}=require("util")
const Signup=require('../models/signup');
const { token } = require('morgan');
// const { db } = require("../models/signup");
// const { Router } = require('express');
// const { token } = require('morgan');
require("dotenv").config({path: '../../.env'});
const JWT_SECRET=process.env.JWT_SECRET
const JWT_EXPIRES=process.env.JWT_EXPIRES
const NODE_ENV=process.env.NODE_ENV
// console.log(JWT_EXPIRES);
// console.log(JWT_SECRET);


const signJwt=(id)=>{
    return jwt.sign({id},JWT_SECRET,{
        expiresIn: JWT_EXPIRES
    })
}

const sendToken=(user,statuscode,req,res)=>{
    const token=signJwt(user._id)
    res.cookie("jwt",token,{
        expires:new Date(Date.now()+JWT_EXPIRES),
        secure: NODE_ENV==='production'? true:false,
        httpOnly:NODE_ENV==='production'? true:false
    })
    console.log("Inside send token")
    res.status(statuscode).json({
        // status:"Success",
        token,
        // user
    })
}

const signout=(req,res)=>{
    res.clearCookie('token')
    res.status(200).json({
        message:"Signed out successfully !"
    })
}
//MIDDLEWARE

const decryptJwt=async(token)=>{
    const jwtverify=promisify(jwt.verify)
    return await jwtverify(token,JWT_SECRET)
}
secure=async (req,res,next)=>{
    let token
    if(req.cookies) token=req.cookies.jwt
    if(!token){
        return res.status(401).json({
            status:"unauthorized",
            message:"You are not authorized to view the content"
        })
    }
    const jwtInfo=await decryptJwt(token)
    console.log(jwtInfo)
    const user=await Signup.findById(jwtInfo.id)
    req.user=user
    next()
}

checkField=(req,res,next)=>{
    var firstname=req.body.email
    var email=req.body.email
    var password=req.body.password
    var cpassword=req.body.cpassword
    if(!firstname || !email || !password || !cpassword){
        console.log('Please enter all the fields')
        res.send('Please enter all the fields')
    }
    else{
        next()
    }

}


checkFieldLogin=(req,res,next)=>{
    var email=req.body.email
    var password=req.body.password
    if(!email || !password){
        console.log('Please enter all the fields')
        res.send('Please enter all the fields')
    }
    else{
        next()
    }

}

function checkUsername(req,res,next){
    var email=req.body.email
    var checkExistUsername=Signup.findOne({email:email})
    checkExistUsername.exec((err,data)=>{
        if(err)throw err
        if(data){
            console.log('Email Exists')
            res.send('Email already exists')
        }
        else{
            next()
        }
    })    
}
function checkPassword(req,res,next){
    var password=req.body.password
    var cpassword=req.body.cpassword
    if(password!=cpassword){
        console.log('Password did not matched')
        res.send('Password did not matched')
    }
    else{
        next()
    }  
}

router.get('/',(req,res)=>res.send("This is Home page !!"))

router.post('/signup',checkField,checkUsername,checkPassword,async (req,res)=>{
    console.log("Signup :", req.body)
    // const data=req.body
    var firstname=req.body.firstname
    var lastname=req.body.lastname
    var email=req.body.email
    var number=req.body.number
    var password=req.body.password
    // password=bcryptjs.hashSync(password,10) //encrypting the password
    // var newSignup=new Signup({
    //     username:username,
    //     password:password
    // })
    // newSignup.save((error)=>{
    //     if(error){
    //         console.log('Error occured in pushing the data')
    //         // res.status(500).json({msg:'error occured'})
    //     }
    //     else{
    //         sendToken(newSignup,201,req,res)
    //         console.log('Data pushed')
    //         res.send("Done")
    //         // proxy.web(req, res, { target: 'http://localhost:3000/log-in' });
    //         // res.json({msg:'Successfully pushed'})
    //     }
    // })

    try{
        // console.log(firstname,lastname,email,password)
        const newSignup = await Signup.create({
            firstname:firstname,
            lastname:lastname,
            email:email,
            number:number,
            password:password
        })
        // sendToken(newSignup,201,req,res)
        console.log(newSignup)
        res.send("Done")
    }
    catch(err){
        res.status(401).json(err.message);
    }
})
router.post('/login',checkFieldLogin,(req,res,next)=>{
    console.log('Login :',req.body)
    const email=req.body.email
    const password=req.body.password

    var checkUser=Signup.findOne({email:email})
    // console.log(checkUser)
    checkUser.exec((err,data)=>{
        // console.log("Inside execution")
        if(!data){
            console.log('Not exist')
            res.send("Email does not exist")
        }
        else{
            // console.log(data)
            var dbpassword=data.password
            if(dbpassword==password){
                console.log("Logging in")
                //sendToken(checkUser,201,req,res)
                const jwt_token=jwt.sign({_id:data._id,role:"user"},process.env.JWT_SECRET,{expiresIn: '1hr'})
                // res.send("successfull")
                res.cookie('token',token,{expiresIn:'1hr'})
                res.status(200).json({
                    jwt_token,
                    user: data
                })
                console.log("Login successfull")
            }
            else{
                console.log('Please check again !')
                // res.status(400).json({
                //     message: "Password Incorrect"
                // })
                res.send("Password Incorrect")
            }
        }
        // console.log('Data is :',data)
        //var dbpassword=data.password
        //If bcryptJS is used
        // if(bcryptjs.compareSync(password,dbpassword)){
        //     console.log('Login Successful !')
        // }
        // else{
        //     console.log('Check Again')
        // }

        // if(dbpassword==password){
        //     sendToken(checkUser,201,req,res)
        //     console.log("Login successfull")
        // }
        // else{
        //     console.log('Please check again !')
        //     res.send("Password incorrect !")
        // }
    })
    // console.log('passport authenticate')
    // passport.authenticate('local',{
    //     successRedirect:'/',
    //     failureRedirect:'/',
    //     failureFlash:true
    // })(req,res,next)
    // passport.authenticate('local',function(error,user,msg){
    //     console.log("Inside authentication")
    //     if(error){
    //         res.status(500).json({
    //             message:'Opps !!',
    //             error:error.message || 'Internal server error'
    //         })
    //     }
    //     // return res.json({
    //     //     // message:'User Authenticated'
    //     //     user
    //     // })
    //     // req.logIn(user,function(error){
    //     //     if(error){
    //     //         res.status(500).json({
    //     //             message:'Opps !!',
    //     //             error:error.message || 'Internal server error'
    //     //         })
    //     //     }
    //     //     user.isAuthenticated=true
    //     //     return res.json(user)
    //     // })
    // })(req,res,next)
    // console.log('passport authenticate done')
})
router.post('/checktoken',requireSignin,(req,res)=>{
    res.status(200).json({})
})
router.post('/signout',requireSignin, signout)
router.post('/feed',requireSignin,(req,res)=>res.status(200).json({
    message:"Working fine"
}))
// router.use(secure)
// router.post('/feed',requireSignin,(req,res)=>res.status(200).json({
//     message:"Working fine"
// }))

router.post('/sendmessage',(req,res)=>{
    console.log(req.body)
    const {name,email,message}=req.body
    const auth={
        auth:{
            api_key: `${process.env.MAIL_GUN_API_KEY}`,
            domain: `${process.env.MAIL_GUN_DOMAIN}`
        }
    }

    const transporter = nodemailer.createTransport(mailgun(auth))

    const mailOption={
        from:email,
        to:'eswarupkumar1111@gmail.com',
        subject:`Review from ${name}`,
        text:message
    }

    transporter.sendMail(mailOption,(err,data)=>{
        if(err) return res.status(500).json(err)
        console.log(data)
        res.status(200).json(data)
    })
})

module.exports = router;