const mongoose = require('mongoose');
const s = new mongoose.Schema({
  userName:{type:String,required:true,trim:true},
  email:{type:String,required:true,lowercase:true},
  phone:{type:String,required:true},
  selectedTrip:{type:String,required:true},
  travelers:{type:Number,required:true,min:1},
  travelType:{type:String,default:'group'},
  budget:{type:String,default:''},
  preferredDate:{type:String,default:''},
  specialNeeds:[String],
  message:{type:String,default:''},
  status:{type:String,enum:['pending','contacted','confirmed'],default:'pending'},
  adminNote:{type:String,default:''},
  reminded:{type:Boolean,default:false}
},{timestamps:true});
module.exports = mongoose.model('Inquiry',s);
