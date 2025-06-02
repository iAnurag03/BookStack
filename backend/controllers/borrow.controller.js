import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import errorHandler from "../middlewares/errorMiddlewares.js";
import { Book } from "../models/book.model.js";
import { Borrow } from "../models/borrow.model.js";
import { User } from "../models/user.model.js";
import { calculateFine } from "../utils/calculateFine.js";

export const borrowedBooks = catchAsyncErrors(async(req,res,next)=>{
    const {borrowedBooks} = req.user;
    res.status(200).json({
      success:true,
      borrowedBooks,
    });
});

export const recordBorrowedBook = catchAsyncErrors(async(req,res,next)=>{
   const {id} = req.params;
   const {email} = req.body;
   const book = await Book.findById(id);
   if(!book){
      return next(new errorHandler("Book not found",404));

   }
   const user = await User.findOne({email, accountVerified:true});
   if(!user){
      return next(new errorHandler("User not found",404));
   }
   if(book.quantity===0){
      return next(new errorHandler("Book currently Unavailable",400));
   }
   const isAlreadyBorrowed = user.borrowedBooks.find((b)=> b.bookId.toString()===id && b.returned===false);
   if(isAlreadyBorrowed) {
      return next(new errorHandler("you cannot borrow the same book multiple times",400));
   }
   book.quantity -=1;
   book.availability = book.quantity>0;
   await book.save();
   user.borrowedBooks.push({
      bookId: book._id,
      booktitle : book.title,
      borrowedDate: new Date(),
      dueDate : new Date(Date.now()+ 7*24*60*60*1000),
   });
   await user.save();
   await Borrow.create({
      user:{
          id:user._id,
          name:user.name,
          email:user.email
      },
      book: book._id,
      dueDate: new Date(Date.now()+7*24*60*60*1000),
      price: book.price
   });
   res.status(200).json({
      success: true,
      message: "book borrow details recorded"
   })

});

export const recordBorrowedBookAdmin = catchAsyncErrors(async(req,res,next)=>{
   const borrowedBooks = await Borrow.find();
   res.status(200).json({
      success:true,
      borrowedBooks,
    });
});

export const returnBorrowedBooks = catchAsyncErrors(async(req,res,next)=>{
        const {bookId} = req.params;
        const {email} = req.body;
        const book = await Book.findById(bookId);
        if(!book){
            return next(new errorHandler("Book not found",404));
        }
        const user = await User.findOne({email, accountVerified:true});
        if(!user){
            return next(new errorHandler("User not found",404));
         }

        const borrowedBook = user.borrowedBooks.find(
          (b) => b.bookId.toString()=== bookId && b.returned===false
        );
        if(!borrowedBook){
         return next(new errorHandler("user has not borrowed this book"));
        }
        borrowedBook.returned=true;
        await user.save();
        book.quantity += 1;
        await book.save();
        const borrow = await Borrow.findOne({
         book : bookId,
         "user.email": email,
         returnedDate: null,
        })
        if(!borrow){
         return next(new errorHandler("Book not borrowed by the user",400));
        }
        borrow.returnDate = new Date();
        const fine = calculateFine(borrow.dueDate);
        borrow.fine = fine;
        await borrow.save();
        res.status(200).json({
         success : true,
         message : fine !== 0? `Total charges (including late return fine): ${book.price+fine}`:`Book returned successfully. Total charge is ${book.price} Rupees.`
        })


});
