import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../schema/user.model.js';
import Account from '../schema/account.model.js';

import {
    userRegisterValidation,
    userLoginValidation,
    userUpdateValidation
} from '../utils/userValidation.js';

export const registerUser = async (req,res,next)=>{
  try{
    const body = req.body;

    /*1.)validate the payload by zod*/
    const payLoadParse = userRegisterValidation.safeParse(body);
    if(!payLoadParse.success){
      res.status(200).json({
        success:false,
        message:payLoadParse.error.errors[0].message
      });
    }

    /*2.)Check user already exit or not*/
    const userCount = await User.findOne({
      email:body.email,
      status:true
    },{_id:1});
    
    if(userCount){
      res.status(200).json({
        message:"User already exists with given email id."
      })
    }
    
    /*3.) create user and also encript user password first*/
    const encryptedPassword = await bcrypt.hash(body.password,10);
    // console.log(await bcrypt.compare(body.password,encryptedPassword));
    body.password=encryptedPassword;
    const user = await User.create(body);

    /*4.) Assign free coin on signUp*/
    const randomCoin = Math.floor(Math.random() * 10000) + 1;
    await Account.create({
      userId:user._id,
      balance:randomCoin
    })

    /*5.) generate the jwt token*/
    const JWT_KEY = process.env.JWT_SECRET_KEY;

    const token = jwt.sign(
      {userId:user._id},
      JWT_KEY,
      {expiresIn:"10d"}
    );

    res.status(200).json({
      success:true,
      message:"User has been registered successfully",
      data:{
        userName:body.firstName + ' ' + body.lastName,
        token:token
      }
    })
  }catch(error){
    console.log(error);
  }
}

export const loginUser = async (req,res,next)=>{
  try{
    const body = req.body;

    /*1.) validate payload*/
    const payloadParse = userLoginValidation.safeParse(body);
    if(!payloadParse.success){
      res.status(200).json({
        success:false,
        message:payloadParse.error.errors[0].message
      });
    }

    /*2.) find user exist with given email or not*/
    const userDetails = await User.findOne({email:body.email,status:true});
    if(!userDetails){
      res.status(200).json({
        success:false,
        message:'Please pass a valid email or password'
      });
    }

    /*3.) varify password*/
    const encodedPassword = userDetails.password;
    const rawPassword = body.password;
    const isPasswordCorrect = await bcrypt.compare(rawPassword,encodedPassword);
    // console.log(isPasswordCorrect,'isPasswordCorrect');
    // process.exit(0);

    /*4.) after password varification,generate token and return success message*/
    if(isPasswordCorrect){
      const JWT_KEY = process.env.JWT_SECRET_KEY;
      const jwtData = {
        userId:userDetails._id
      }
      const token = jwt.sign(jwtData,JWT_KEY,{expiresIn:"10d"});

      res.status(200).json({
        success:true,
        message:"User has been loggedin successfully",
        data:{
          userName:userDetails.firstName,
          token:token
        }
      })
    }else{
      res.status(411).json({
        success:false,
        message:'Password is incorrect.'
      });
    }
  }catch(error){
    console.log(error);
  }
}

export const updateUserInfo = async( req,res,next)=>{
  try{  
    const body = req.body;
    const userId = req.tokenDecodedData.userId;
    
    /*Validate the payload*/
    const payloadParse = userUpdateValidation.safeParse(body);
    if(!payloadParse.success){
      res.status(200).json({
        success:false,
        message:payloadParse.error.errors[0].message
      });
    }

    /*updating user details*/
    if(body && body.password){
      const encryptPassword = await bcrypt.hash(body.password,10);
      body.password=encryptPassword;
    }
    
    await User.updateOne({_id:userId},{
      $set:{
        firstName:body.firstName,
        lastName:body.lastName,
        password:body.password
      }
    })
    res.status(200).json({
      success:true,
      message:"User information has been updated successfully",
      data:null
    })
  }catch(error){
    console.log(error);
  }
}

export const getAllUser = async (req,res,next)=>{
  try{
    const searchKey = req.query.searchKey ? req.query.searchKey : '';
    const searchRegExp = new RegExp(searchKey, 'i'); // 'i' flag makes the search case-insensitive

    const getAllUsers = await User.find({
      status:true,
      $or: [
        { firstName: searchRegExp },
        { lastName: searchRegExp },
    ]
    },{
      email:1,
      firstName:1,
      lastName:1,
      createdAt:1,
      updatedAt:1
    });
    // console.log(getAllUsers[0].password);
    // process.exit(0)
    const msg = getAllUsers.length >0 ? 'User Found!' :'User not found!'
    res.status(200).json({
      success:true,
      message:msg,
      data:getAllUsers
    })
  }catch(error){
    console.log(error);
  }
}