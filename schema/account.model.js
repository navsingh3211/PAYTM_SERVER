import {Schema,model} from 'mongoose';

const schema = new Schema({
  userId:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index:true
  },
  balance:{
    type:Number,
    required:true
  }
},
{
  timestamps:true
}
);

export default model('Account',schema);