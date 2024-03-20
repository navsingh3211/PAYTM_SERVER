import mongoose from 'mongoose';
import Account from '../schema/account.model.js';
import {transferMoneyValidation} from '../utils/userValidation.js';

export const getUserAccountBalance = async(req,res)=>{
  try{
    const userId = req.tokenDecodedData.userId;
    const accountDetails = await Account.findOne({userId:userId});
    res.status(200).json({
      success:true,
      message:'User a/c balance',
      balance:accountDetails.balance
    });
  }catch(error){
    console.log(error);
  }
}

export const transferMoney = async(req,res)=>{
  try{
    const userId = req.tokenDecodedData.userId;
    const body = req.body;

    /*Payload validation*/
    const validatePayload = transferMoneyValidation.safeParse(body);
    if(!validatePayload.success){
      res.status(200).json({
        success:false,
        message:validatePayload.error.errors[0].message
      });
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    /*Checking that transfer amount is exist in user a/c balance or not*/
    const userPrime = await Account.findOne({userId:userId});
    const primeUserAccountBalance = userPrime.balance;
    if(primeUserAccountBalance < body.amount){
      await session.abortTransaction();
      res.status(200).json({
        success:false,
        message:'Insufficient balance.'
      })
    }

    const toAccount = await Account.findOne({ userId: body.to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      res.status(200).json({
          message: "Invalid account"
      });
    }

    /*Transfer money now and implementing transaction roll-back too*/
    const primeUserUpdate = await Account.updateOne({userId:userId},{
      $inc: { balance: - body.amount }
    }).session(session);

    const toUserUpdate = await Account.updateOne({userId:body.to},{
      $inc: { balance:  body.amount }
    }).session(session);

    // Commit the transaction
    await session.commitTransaction();

    res.status(200).json({
      success:true,
      message:'Money has been transfered to another user successfully.',
      data:null
    });
    
  }catch(error){
    console.log(error);
  }
}