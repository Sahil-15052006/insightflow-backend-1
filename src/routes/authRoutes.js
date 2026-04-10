const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const jwt = require('jsonwebtoken')
require("dotenv").config()

const router = express.Router();

// register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const emailExists = await User.findOne({email})

    if (!email || !password) return res.status(400).json({ message: "Email and password required" });

    if (emailExists) {
        return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    res.status(201).json({ message: "User created sucessfully" });

  } catch (error) {

    res.status(500).json({
      message: "Failed to create user",
      error: error.message,
    });
  }
});

// login user
router.post('/login',async(req,res)=>{
    try{

        const {email,password} = req.body

        if (!email || !password) return res.status(400).json({ message: "Email and password required" });

        const user = await User.findOne({email})
        if (!user) return res.status(404).json({message:"Email not found"})

        const isMatch =  await bcrypt.compare(password,user.password)
        if (!isMatch) return res.status(400).json({message:"Wrong password"})
        
        const token = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
        )

        res.cookie("token",token,{
            httpOnly:true,
            secure:false,
            maxAge:7*24*60*60*1000
        })

        res.json({token})

        res.status(200).json({
            message:'logged in successfully',
        })

    }catch(err){

        res.status(500).json({
            message:"Server Error",
            error:err.message
        })

    }
})

// guest login 
router.post('/guest',async(req,res)=>{

    try{
        const guestUser = new User({
            name:`guest${Date.now()}${Math.floor(Math.random()*10000)}`,
            role:"guest",
            expiresAt:new Date(Date.now()+24*60*60*1000)
        })

        await guestUser.save()

        const token = jwt.sign(
            {id:User._id},
            process.env.JWT_SECRET,
            {expiresIn:'1d'}
        )

        res.cookie('token',token,{
            httpOnly:true,
            secure:true,
            maxAge:24*60*60*1000
        })

        res.json({token})
        
        res.status(200).json({
            message:'guest logged in successfully',
        })

    } catch(err) {

        res.json({
            message:"Error in guest login",
            error:err.message
        })
    }
})

// logout User 
router.post('/logout',(req,res)=>{
    res.clearCookie('token')
    res.json({message:'Logged out'})
})


module.exports=router