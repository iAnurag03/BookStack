//import express from "express";

import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import errorHandler from "../middlewares/errorMiddlewares.js";
import { Book } from "../models/book.model.js";

export const addBook = catchAsyncErrors(async(req,res,next)=>{
      const {title,author, description, price, quantity}= req.body;
      if(!title || !author || !price || !description || !quantity){
        return next(new errorHandler("Provide complete book details",400));
      }
      const book = await Book.create({
        title,
        author,
        description,
        price,
        quantity
      });
      res.status(200).json({
        success:true,
        message:"book added successfully"
      })
});

export const deleteBook = catchAsyncErrors(async(req,res,next)=>{
       const {id} = req.params;
       const book = await Book.findById(id);
       if(!book){
           return next(new errorHandler("Book not found", 404));
       }
       await book.deleteOne();
       res.status(200).json({
           success: true,
           message: "Book deleted successfully"
       });
});

export const allBook = catchAsyncErrors(async(req,res,next)=>{
     const books = await Book.find();
     res.status(200).json({
        success:true,
        books,
     });
});