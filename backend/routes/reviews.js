const express = require('express');
const Review = require('../models/Review');
const {userProtect} = require('../middleware/auth');
const r = express.Router();

r.get('/trip/:tripId', async(req,res)=>{
  try{
    const reviews=await Review.find({trip:req.params.tripId}).populate('user','name avatar').sort({createdAt:-1});
    const avg=reviews.length?(reviews.reduce((s,r)=>s+r.rating,0)/reviews.length).toFixed(1):0;
    res.json({reviews,averageRating:Number(avg),totalReviews:reviews.length});
  }catch(err){res.status(500).json({message:err.message});}
});

r.post('/',userProtect,async(req,res)=>{
  try{
    const{trip,rating,comment}=req.body;
    if(!trip||!rating||!comment) return res.status(400).json({message:'All fields required.'});
    if(await Review.findOne({trip,user:req.user.id})) return res.status(400).json({message:'You have already reviewed this trip.'});
    const review=await Review.create({trip,user:req.user.id,rating,comment});
    res.status(201).json(await Review.findById(review._id).populate('user','name avatar'));
  }catch(err){res.status(400).json({message:err.message});}
});

r.delete('/:id',userProtect,async(req,res)=>{
  try{
    const review=await Review.findById(req.params.id);
    if(!review) return res.status(404).json({message:'Review not found.'});
    if(review.user.toString()!==req.user.id) return res.status(403).json({message:'Not authorized.'});
    await review.deleteOne();
    res.json({message:'Review deleted.'});
  }catch(err){res.status(500).json({message:err.message});}
});

module.exports = r;
