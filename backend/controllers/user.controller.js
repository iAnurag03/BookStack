import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import errorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcrypt"
import {v2 as cloudinary} from "cloudinary"
export const getAllUsers = catchAsyncErrors(async(req,res,next)=>{
   const users = await User.find({accountVerified:true});
    res.status(200).json({
        success:true,
        users
    });

});

export const registerNewAdmin = catchAsyncErrors(async(req,res,next)=>{
     console.log("Files received:", req.files);
     console.log("Request body:", req.body);
     
     if(!req.files){
        console.log("No files or avatar found in request");
        return next(new errorHandler("Avatar is required", 400));
     }
     
     const {name,email, password} = req.body;
     if(!name || !email || !password){
        return next(new errorHandler("provide all details",400));
     }
     const isRegistered = await User.findOne({
        email, accountVerified:true
     });
     if(isRegistered){
        return next(new errorHandler("Already registered ",400));
     }
     if(password.length<8 || password.length>16){
         return next(new errorHandler("password should be 8 to 16 characters long",400));
     }
  
     const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

     const {avatar} = req.files;
     if(!allowedFormats.includes(avatar.mimetype)){
        return next(new errorHandler("File format not supported",400));
     }

     const hashedPassword = await bcrypt.hash(password,10);
     const cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath , {
            folder : "BOOKSTACK_ADMINS_AVAtAR"
        }
     );
     if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary error:", cloudinaryResponse.error||"unknown error");
        return next(new errorHandler("failed to upload, try again later",500))
     }

     const user = await User.create({
         name,
         email, 
         password :hashedPassword,
         role:"Admin",
         accountVerified:true,
         avatar:{
            public_id : cloudinaryResponse.public_id,
            url : cloudinaryResponse.secure_url
         }
     });
     res.status(200).json({
        success: true,
        message :"Admin registered successfully",
        user
     });
});

