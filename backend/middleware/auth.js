const jwt = require('jsonwebtoken');
const protect = (req,res,next) => {
  const token = req.cookies?.adminToken || req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).json({message:'Unauthorized.'});
  try{req.admin=jwt.verify(token,process.env.JWT_SECRET);next();}
  catch{res.status(401).json({message:'Invalid token.'});}
};
const userProtect = (req,res,next) => {
  const token = req.cookies?.userToken || req.headers.authorization?.split(' ')[1];
  if(!token) return res.status(401).json({message:'Please login.'});
  try{req.user=jwt.verify(token,process.env.JWT_SECRET);next();}
  catch{res.status(401).json({message:'Invalid token.'});}
};
module.exports = {protect,userProtect};
