import mongoose from "mongoose";
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email:{
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30
  },
  firstName:{
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
    index:true
  },
  lastName:{
    type: String,
    required: true,
    trim: true,
    maxLength: 50
  },
  password:{
    type:String,
    required: true,
    minLength: 6
  },
  status:{
    type:Boolean,
    default:true,
    index:true
  }
},
{
  timestamps:true
}
);

export default model('User',userSchema);