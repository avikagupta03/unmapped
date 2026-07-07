const express = require('express');
const Inquiry = require('../models/Inquiry');
const Trip = require('../models/Trip');
const {protect} = require('../middleware/auth');
const {sendBookingConfirmation,sendAdminNotification} = require('../utils/email');
const r = express.Router();

r.post('/', async(req,res)=>{
  try{
    const{userName,email,phone,selectedTrip,travelers}=req.body;
    if(!userName||!email||!phone||!selectedTrip||!travelers) return res.status(400).json({message:'Fill all required fields.'});
    const inquiry=await Inquiry.create(req.body);
    const trip=await Trip.findOne({title:selectedTrip});
    sendBookingConfirmation(inquiry,trip);
    sendAdminNotification(inquiry);
    res.status(201).json({message:'Inquiry submitted!',inquiry});
  }catch(err){res.status(400).json({message:err.message});}
});

r.get('/',protect,async(req,res)=>{
  try{res.json(await Inquiry.find().sort({createdAt:-1}));}
  catch{res.status(500).json({message:'Server error.'});}
});

r.put('/:id',protect,async(req,res)=>{
  try{
    const updates={};
    if(req.body.status) updates.status=req.body.status;
    if(req.body.adminNote!==undefined) updates.adminNote=req.body.adminNote;
    const inq=await Inquiry.findByIdAndUpdate(req.params.id,updates,{new:true});
    if(!inq) return res.status(404).json({message:'Not found.'});
    res.json(inq);
  }catch{res.status(500).json({message:'Server error.'});}
});

module.exports = r;
