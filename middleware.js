const jwt=require('jsonwebtoken')

exports.requireSignin=(req,res,next)=>{
    // console.log(req)
    console.log("Inside require sign in ",req.headers.authorization)
    if(req.headers.authorization){
        console.log("Header Verification")
        // console.log("Request is : ",req.body)
        const token=req.headers.authorization.split(" ")[1]
        // console.log(token)
        const user =jwt.verify(token,process.env.JWT_SECRET)
        // console.log("User is : ",user)
        req.user=user
        req.role='user'
        next()
    }
    else{
        console.log("No Authorization")
        res.status(400).json({message:"No Authorization"})
    }
}

exports.userMiddleware=(req,res,next)=>{
    // console.log("Username is : ",req.role)
    console.log("Inside usermiddleware")
    if(req.role!="user"){
        return res.status(400).json({message:"Access Denied"})
    }
    next()
}

