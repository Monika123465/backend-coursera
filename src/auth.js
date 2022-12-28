const express=require("express")
const User=require("./models/user")
const jwt = require('jsonwebtoken')
const secretkey = "secretKey"


const app=express.Router()


app.post('/login',async(req,res)=>{
const {email,password}=req.body
try {
    const user=await User.findOne({email})
    if(!user){
        res.status(400).send({message:"user not found with email"})
    }
    if(!password===user.password){res.status(404).send({message:"credential not found"})}
    const token=jwt.sign({user},secretkey,{expiresIn:"600s"})
    user.token=[...user.token]
    return res.send({token,id:user.id,name:user.name,email:user.email})
    
} catch (error) {
    res.status(500).send(error.message)
}
})

app.post('/signup',async(req,res)=>{
    const {name,email,password}=req.body

    try {
        const emailexist=await User.findOne({email})
        if(emailexist){
          return res.status(402).send({
            error:"user already signedup"
          })
        }
        const user=await User.create({name,email,password})
        res.send({
            id:user.id,
            name:user.name,
            password:user.password

        })
        
    } catch (err) {
        res.status(500).send({
            error:err.message
        })
    }
})

app.post('/userprofile', verifytoken,async(req,res)=>{
    try {
        const authData=jwt.verify(req.token,secretkey)
        return res.send(authData)
    } catch (error) {
        res.status(500).send(error.message)
    }

})


function verifytoken(req,res,next){
    const tokens=req.headers["authorization"]
    if(!tokens)
        res.status(402).send({message:"invalid token"})
    const token=tokens.split(" ")[1].trim()
    const user=jwt.verify(token)
    next()
    
}


module.exports=app