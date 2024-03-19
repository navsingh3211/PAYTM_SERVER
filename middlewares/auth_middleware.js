import jwt from 'jsonwebtoken';

export const verifyToken = (req,res,next)=>{
  const token = req.headers['token'];
  if(!token){
    res.status(403).json({
      success:false,
      message:"Please enter the token first"
    })
  }
  const secretKey = process.env.JWT_SECRET_KEY;
  try{
    const decoded = jwt.verify(token,secretKey);
    req.tokenDecodedData = decoded;
    next();
  }catch(error){
    res.status(403).json({
      success:false,
      message:"Invalid token!"
    })
  }
}