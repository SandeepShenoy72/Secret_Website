//jshint esversion:6
require('dotenv').config();
const express = require('express')
const mongoose = require("mongoose")
const encrypt = require("mongoose-encryption")



const app = express()

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/userDB")

const userSchema = new mongoose.Schema( {
    email:{ type: String, required: true},
    password:{ type: String, required: true},
})

var secret_key= process.env.SOME_LONG_STRING
userSchema.plugin(encrypt, {secret:secret_key,encryptedFields: ['password']});

const User = mongoose.model("user",userSchema)

app.use(express.static("public"))
app.set('view engine','ejs')

app.get("/",(req,res)=>{
    res.render("home")
})

app.get("/register",(req,res)=>{
    res.render("register")
})

app.post("/register",(req,res)=>{
    const emailBody = req.body.username;
    const passwordBody = req.body.password;

    const user = new User({
        email:emailBody,
        password:passwordBody
    })
    User.findOne({email:emailBody,password:passwordBody}).then(result =>{
        if(result){
            res.render("secrets")
        }else{
            user.save()
            res.render("secrets")
        }
    })
})

app.get("/login",(req,res)=>{
   
   res.render("login")
})


app.post("/login",(req,res)=>{
    const loginMail = req.body.username
    const loginPassword = req.body.password
    User.findOne({email:loginMail}).then(result =>{
        if(result){
            if(result.password===loginPassword){
               // console.log(result.password);
                res.render("secrets")
            }
           else{
            res.write("<h1>Wrong Password</h1>")
            
           }
        }else{
            res.render("secrets")
        }
    })
})

// app.get("/secrets",(req,res)=>{
//     res.render("secrets")
// })

app.listen(3000,(req,res)=>{
    console.log("Listening on Port 3000");
})
