require("dotenv").config()
const express=require("express")
const cors=require("cors")
const connect=require("./config/db.js")
const userRoute=require("./routes/user")

const PORT=process.env.PORT
const app=express()
app.use(express.json())
app.use(cors())

app.use("/users",userRoute)



app.listen(PORT,async()=>{
 try {
    await connect()
    console.log('db connected')
    } catch (error) {
        console.log(error.message)
        
    }
    console.log(`listen to the port ${PORT} `)
})