import zod from 'zod';

export const userRegisterValidation = zod.object({
  
    email:zod.string().refine((val)=>val.trim().length>0,{
      message:'Please enter the email'
    }),
    firstName:zod.string().refine((val)=>val.trim().length>0,{
      message:'Please enter the first name'
    }),
    lastName:zod.string().refine((val)=>val.trim().length>0,{
      message:'Please enter the last name'
    }),
    password:zod.string().refine((val)=>val.trim().length>0,{
      message:'Please enter the password'
    })

});

export const userLoginValidation = zod.object({
  email:zod.string().refine((val)=>val.trim().length>0,{
    message:'Please enter the email'
  }),
  password:zod.string().refine((val)=>val.trim().length>0,{
    message:'Please enter the password'
  })
});

export const userUpdateValidation = zod.object({
  firstName:zod.string().optional(),
  lastName:zod.string().optional(),
  password:zod.string().optional()
});

export const transferMoneyValidation = zod.object({
  to:zod.string().refine((val)=>val.trim().length>0,{
      message:'Please enter the to'
    }),
  amount:zod.number()
});