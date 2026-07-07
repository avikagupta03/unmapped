const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const {userProtect} = require('../middleware/auth');
const r = express.Router();

const signToken = (user) => jwt.sign({id:user._id,email:user.email,name:user.name},process.env.JWT_SECRET,{expiresIn:'30d'});
const setCookie = (res,token) => res.cookie('userToken',token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:process.env.NODE_ENV==='production'?'none':'lax',maxAge:30*24*60*60*1000});

r.post('/register', async(req,res)=>{
  try{
    const{name,email,password}=req.body;
    if(!name||!email||!password) return res.status(400).json({message:'All fields required.'});
    if(password.length<6) return res.status(400).json({message:'Password must be at least 6 characters.'});
    if(await User.findOne({email:email.toLowerCase()})) return res.status(400).json({message:'Email already registered. Please login.'});
    const user=await User.create({name,email,password});
    const token=signToken(user);
    setCookie(res,token);
    res.status(201).json({message:'Account created!',token,user:{id:user._id,name:user.name,email:user.email,avatar:user.avatar}});
  }catch(err){res.status(500).json({message:err.message});}
});

r.post('/login', async(req,res)=>{
  try{
    const{email,password}=req.body;
    if(!email||!password) return res.status(400).json({message:'Email and password required.'});
    const user=await User.findOne({email:email.toLowerCase()});
    if(!user||!user.password) return res.status(401).json({message:'Invalid credentials.'});
    if(!await user.comparePassword(password)) return res.status(401).json({message:'Invalid credentials.'});
    const token=signToken(user);
    setCookie(res,token);
    res.json({message:'Login successful!',token,user:{id:user._id,name:user.name,email:user.email,avatar:user.avatar}});
  }catch(err){res.status(500).json({message:err.message});}
});

r.post('/google', async(req,res)=>{
  try{
    const{googleId,email,name,avatar}=req.body;
    if(!googleId||!email) return res.status(400).json({message:'Invalid Google data.'});
    let user=await User.findOne({$or:[{googleId},{email:email.toLowerCase()}]});
    if(user){if(!user.googleId){user.googleId=googleId;user.avatar=avatar;await user.save();}}
    else{user=await User.create({name,email,googleId,avatar});}
    const token=signToken(user);
    setCookie(res,token);
    res.json({message:'Google login successful!',token,user:{id:user._id,name:user.name,email:user.email,avatar:user.avatar}});
  }catch(err){res.status(500).json({message:err.message});}
});

r.post('/logout',(req,res)=>{res.clearCookie('userToken');res.json({message:'Logged out.'});});

r.get('/me',userProtect,async(req,res)=>{
  try{
    const user=await User.findById(req.user.id).select('-password').populate('savedTrips','title slug image price duration location type');
    if(!user) return res.status(404).json({message:'User not found.'});
    res.json(user);
  }catch(err){res.status(500).json({message:err.message});}
});

r.post('/save-trip/:tripId',userProtect,async(req,res)=>{
  try{
    const user=await User.findById(req.user.id);
    const{tripId}=req.params;
    const isSaved=user.savedTrips.map(id=>id.toString()).includes(tripId);
    if(isSaved){user.savedTrips=user.savedTrips.filter(id=>id.toString()!==tripId);}
    else{user.savedTrips.push(tripId);}
    await user.save();
    res.json({saved:!isSaved,savedTrips:user.savedTrips});
  }catch(err){res.status(500).json({message:err.message});}
});

r.get('/my-inquiries',userProtect,async(req,res)=>{
  try{
    const Inquiry=require('../models/Inquiry');
    res.json(await Inquiry.find({email:req.user.email}).sort({createdAt:-1}));
  }catch(err){res.status(500).json({message:err.message});}
});

module.exports = r;
