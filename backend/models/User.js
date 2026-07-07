const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const s = new mongoose.Schema({
  name:{type:String,required:true,trim:true},
  email:{type:String,required:true,unique:true,lowercase:true},
  password:{type:String,default:null},
  googleId:{type:String,default:null},
  avatar:{type:String,default:''},
  savedTrips:[{type:mongoose.Schema.Types.ObjectId,ref:'Trip'}]
},{timestamps:true});
s.pre('save',async function(next){if(this.password&&this.isModified('password')){this.password=await bcrypt.hash(this.password,12);}next();});
s.methods.comparePassword=async function(p){return bcrypt.compare(p,this.password);};
module.exports = mongoose.model('User',s);
