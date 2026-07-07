const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const {protect} = require('../middleware/auth');
const r = express.Router();
r.post('/login', async(req,res)=>{
  try{
    const{email,password}=req.body;
    const admin=await Admin.findOne({email:email?.toLowerCase()});
    if(!admin||!await bcrypt.compare(password,admin.password)) return res.status(401).json({message:'Invalid credentials.'});
    const token=jwt.sign({id:admin._id,email:admin.email},process.env.JWT_SECRET,{expiresIn:'7d'});
    res.cookie('adminToken',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:process.env.NODE_ENV==='production'?'none':'lax',maxAge:7*24*60*60*1000});
    res.json({message:'Login successful',token});
  }catch{res.status(500).json({message:'Server error.'});}
});
r.post('/logout',(req,res)=>{res.clearCookie('adminToken');res.json({message:'Logged out.'});});
r.get('/me',protect,(req,res)=>res.json({admin:req.admin}));
module.exports = r;
