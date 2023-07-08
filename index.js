import express from 'express';
// import express from "express"; This can be done using simple change in pakage.js file as "type":"module".
// const cors = require("cors");
import cors from 'cors';
// const mongoose = require("mongoose");
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Configuration
const app=express();
app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
dotenv.config();

const USERNAME=process.env.DB_USERNAME;
const PASSWORD=process.env.DB_PASSWORD;

const MONGODB_URL=`mongodb+srv://${USERNAME}:${PASSWORD}@login-register-database.iyjw6np.mongodb.net/login_register?retryWrites=true&w=majority`;

mongoose.connect(MONGODB_URL, {
    useNewUrlParser:true,
    useUnifiedTopology:true
}, ()=>{
    console.log("DB connected");
});

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String
});

const User=new mongoose.model("User",userSchema) // "User" is the name of the model

// Routes
app.post("/login",(req,res)=>{
    const {email, password}= req.body;
    User.findOne({email:email},(err,user)=>{
        if(user)
        {
            if(password===user.password)
            {
                res.send({message:"Login Successful.",user:user})
            }
            else
            {
                res.send({message:"Password didn't match."});
            }
        }
        else
        {
            res.send({message:"User not registered"});
        }
    })
});

app.post("/register",(req,res)=>{
    // console.log(req.body);
    const {name, email, password}= req.body;
    User.findOne({email:email},(err,user)=>{
        if(user)
        {
            res.send({message: "User already registered"})
        }
        else
        {
            const user = new User({
                name,
                email,
                password
            });
            user.save(err =>{
                if(err)
                {
                    res.send(err);
                }
                else
                {
                    res.send({message:"Successfully Registered, Login Now."});
                }
            });
        }
    })
});

app.listen(9002,()=>{
    console.log("Be started at port 9002");
});