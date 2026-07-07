const mongoose = require('mongoose');
const s = new mongoose.Schema({
  trip:{type:mongoose.Schema.Types.ObjectId,ref:'Trip',required:true},
  user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  rating:{type:Number,required:true,min:1,max:5},
  comment:{type:String,required:true,trim:true}
},{timestamps:true});
s.index({trip:1,user:1},{unique:true});
module.exports = mongoose.model('Review',s);
