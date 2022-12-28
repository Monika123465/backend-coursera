const mongoose=require("mongoose")

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    token:[{
        type:String,
        required:false
    }],
    // otp:{
    //     type:Number,
    //     required:true
    // }
},

{
    versionKey:false,
          timestamp:true
})

const User=mongoose.model("user",userSchema)
module.exports=User