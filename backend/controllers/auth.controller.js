import { User } from "../models/user.model.js";
import bcrypt from "bcrypt"
import crypto from "crypto"
import errorHandler from "../middlewares/errorMiddlewares.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import {generateForgotPasswordEmailTemplate} from "../utils/emailTemplate.js"
export const register = catchAsyncErrors(async(req,res,next)=>{
    try{
        const { name , email, password} = req.body;
        if(!name || !email || !password) {return next(new errorHandler("enter all fields",400));}
        
        const  isRegistered = await User.findOne({email, accountVerified:true});
        if(isRegistered){
            return next(new errorHandler("user already exist",400));
        }
        const registerationAttempts = await User.find({
            email,
            accountVerified:false,
        });

        if(registerationAttempts.length>=5){
            return next(new errorHandler("too many attempts, try again later",400));
        }
        if(password.length<6 || password.length>16){
            return next(new errorHandler("password length must be between 6 to 16 characters",400));
         
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password:hashedPassword
        })

        const verificationCode = await user.generateVerificationCode();
        await user.save();
        sendVerificationCode(verificationCode, email, res);



    }catch(error){
        next(error);
    }
});

export const verifyOTP = catchAsyncErrors(async(req,res,next)=>{
    const {email, otp} = req.body;
    if(!email || !otp){
        return next(new errorHandler("missing details", 400));
    }
    try{
         const userAllEntries = await User.find({
            email,
            accountVerified: false,
         }).sort({createdAt:-1})

        if(!userAllEntries){
            return next(new errorHandler("user not found",404));
        }
        let user;
        if(userAllEntries.length>1){
            user = userAllEntries[0];
            await User.deleteMany({
                _id:{$ne: user._id},
                email,
                accountVerified: false,
            });
        }
        else {
           user = userAllEntries[0];
        }
        if(user.verificationCode !== Number(otp)){
            return next(new errorHandler("invalid otp", 400));
        }
        const currentTime = Date.now();

        const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime();

        if(currentTime > verificationCodeExpire){
            return next (new errorHandler("otp expired", 400));
        }
         user.accountVerified=true;
         user.verificationCode=null;
         user.verificationCodeExpire= null;

         await user.save({validateModifiedOnly : true});

         sendToken(user, 200, "Account Verified", res);
    }catch(error){
        console.error("OTP Verification Error:", error);
        return next(new errorHandler("internal server error",500));
    }
});

export const login = catchAsyncErrors(async(req,res,next)=>{
    const {email,password} = req.body;
    if( !email || !password){
        return next(new errorHandler("enter complete details", 400));
    }
    const user = await User.findOne({email, accountVerified:true}).select("+password");
    if(!user){
        return next(new errorHandler("Invalid email or password", 400));
    }
    const isPasswordCorrect = await bcrypt.compare(password,user.password);
    if(!isPasswordCorrect) return next(new errorHandler("Invalid email/pasword",400));
    sendToken(user, 200, "login successfull", res);
});

export const logout = catchAsyncErrors( async (req,res,next)=>{
    res.status(200).cookie("token", "",{
        expires: new Date(Date.now()),
        httpOnly: true,
    })
    .json({
        success: true,
        message: "logged out successfully",
    });
});

export const getUser = catchAsyncErrors(async (req, res, next)=>{
    const user= req.user;
    res.status(200).json({
        success:true,
        user,
    });
 });

export const forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    if(!req.body.email){
        return next(new errorHandler("please enter email",400));
    }
    const user = await User.findOne({
        email: req.body.email,
        accountVerified: true,
    });
    if(!user){
        return next(new errorHandler("No user found",400));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({validateBeforeSave:false});
    const resetPasswordUrl =`${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

    const message = generateForgotPasswordEmailTemplate(resetPasswordUrl);
    try{
      await sendEmail({
        email:user.email,
         subject:"bookstack password recovery",
         message,
        })
        res.status(200).json({
            success:true,
            message: `email sent to ${user.email}`
        })
    }catch(error){
        user.resetToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({validateBeforeSave:false});
        return next( new errorHandler(error.message, 500));
    }
})

export const resetPassword = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.params;
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    });
    if(!user){
        return next(new errorHandler("reset token  invalid, try again",400));
    }
    if(req.body.password !== req.body.confirmPassword){
        return next(new errorHandler("passwords do not match", 400));
    }
    if(req.body.password.length <8 || 
       req.body.password.length >16 ||
       req.body.confirmPassword.length <8 ||
       req.body.confirmPassword.length >16 ){
        return next(new errorHandler("password length should be 8 to 16 characters", 400));    
    }
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    sendToken(user,200, "password changed",res);
})

export const updatePassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user._id).select("+password");
    const {currentPassword, newPassword, confirmNewPassword} = req.body;

    if(!currentPassword || !newPassword || !confirmNewPassword){
        return next(new errorHandler("enter all fields",400)); 
    }
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if(!isPasswordCorrect){
        return next(new errorHandler("current password is not correct"))
    }
    if( newPassword.length <8 || 
        newPassword.length >16 ||
        confirmNewPassword.length <8 ||
        confirmNewPassword.length >16 ){
         return next(new errorHandler("password length should be 8 to 16 characters", 400));    
     }
    
    if(newPassword !== confirmNewPassword){
        return next(new errorHandler("new passwords do not match"))
    }
    const hashedPassword = await bcrypt.hash(newPassword,10);
    user.password = hashedPassword;
    await user.save();
    res.status(200).json({
        success:true,
        message: "password updated"
    })

})