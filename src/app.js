const express = require('express')
const cookieParse = require('cookie-parser')
const cors = require('cors')

const authRoutes = require('./routes/authRoutes')
const authMiddleware = require('./middleware/authMiddleware')
const uploadRoutes = require('./routes/uploadRoutes')
const analyzeRoutes = require('./routes/analyzeRoutes')
const User = require('./models/userModel')
const datasetRoutes = require("./routes/datasetRoutes");

const app=express()

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json())
app.use(cookieParse())
app.use(cors({
    origin:"*", 
    Credential:true
}))

app.use('/auth',authRoutes)
app.use('/uploadFile',uploadRoutes)
app.use('/analyzeData',analyzeRoutes)
app.use("/api/datasets", datasetRoutes);

if (dataset.userId.toString() !== req.user.id) {
  return res.status(403).json({ message: "Unauthorized" });
}

app.get('/userInfo',authMiddleware,async(req,res)=>{
  try{
    const user = await User.findById(req.user.id).select("-password")
    res.json({user})
  }catch(err){
    res.json({
      message:"Failed to get user data",
    })
  }
})

app.get("/auth/verify", authMiddleware, (req, res) => {
  res.json({
    message: "Token is valid",
    user: req.user,
  });
});

module.exports=app
