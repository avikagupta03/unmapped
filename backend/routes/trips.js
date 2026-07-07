const express = require('express');
const Trip = require('../models/Trip');
const {protect} = require('../middleware/auth');
const r = express.Router();

r.get('/', async(req,res)=>{
  try{
    const f={isActive:true};
    if(req.query.type) f.type=req.query.type;
    if(req.query.experienceType) f.experienceType=req.query.experienceType;
    if(req.query.difficulty) f.difficulty=req.query.difficulty;
    if(req.query.search){
      const re=new RegExp(req.query.search,'i');
      f.$or=[{title:re},{location:re},{vibeTags:re}];
    }
    res.json(await Trip.find(f).sort({createdAt:-1}));
  }catch{res.status(500).json({message:'Server error.'});}
});

r.get('/slug/:slug', async(req,res)=>{
  try{
    const t=await Trip.findOne({slug:req.params.slug,isActive:true});
    if(!t) return res.status(404).json({message:'Not found.'});
    res.json(t);
  }catch{res.status(500).json({message:'Server error.'});}
});

r.get('/admin/all',protect,async(req,res)=>{
  try{res.json(await Trip.find().sort({createdAt:-1}));}
  catch{res.status(500).json({message:'Server error.'});}
});

r.get('/:id',protect,async(req,res)=>{
  try{
    const t=await Trip.findById(req.params.id);
    if(!t) return res.status(404).json({message:'Not found.'});
    res.json(t);
  }catch{res.status(500).json({message:'Server error.'});}
});

r.post('/',protect,async(req,res)=>{
  try{
    if(!req.body.slug) req.body.slug=req.body.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
    res.status(201).json(await Trip.create(req.body));
  }catch(e){res.status(400).json({message:e.message});}
});

r.put('/:id',protect,async(req,res)=>{
  try{
    const t=await Trip.findByIdAndUpdate(req.params.id,req.body,{new:true});
    if(!t) return res.status(404).json({message:'Not found.'});
    res.json(t);
  }catch(e){res.status(400).json({message:e.message});}
});

r.delete('/:id',protect,async(req,res)=>{
  try{await Trip.findByIdAndDelete(req.params.id);res.json({message:'Deleted.'});}
  catch{res.status(500).json({message:'Server error.'});}
});

module.exports = r;
