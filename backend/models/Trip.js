const mongoose = require('mongoose');
const s = new mongoose.Schema({
  title:{type:String,required:true,trim:true},
  slug:{type:String,required:true,unique:true,lowercase:true},
  description:{type:String,required:true},
  type:{type:String,enum:['trip','trek'],required:true},
  image:{type:String,required:true},
  gallery:[String],
  location:{type:String,required:true},
  duration:{type:String,required:true},
  price:{type:Number,required:true},
  seatsAvailable:{type:Number,required:true,default:10},
  difficulty:{type:String,enum:['easy','moderate','challenging','high-altitude'],default:'easy'},
  experienceType:{type:String,enum:['hills','beaches','forests','desert','culture'],default:'hills'},
  whoIsItFor:[String],
  included:[String],
  excluded:[String],
  stayType:{type:String,default:''},
  stayDescription:{type:String,default:''},
  localTransport:{type:String,default:''},
  importantNotes:{type:String,default:''},
  vibeTags:[String],
  isActive:{type:Boolean,default:true}
},{timestamps:true});
module.exports = mongoose.model('Trip',s);
