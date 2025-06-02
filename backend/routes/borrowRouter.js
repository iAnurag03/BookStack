import express from "express"
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import { borrowedBooks, recordBorrowedBook, recordBorrowedBookAdmin, returnBorrowedBooks } from "../controllers/borrow.controller.js";

const router = express.Router();

router.post("/record-borrowed-books/:id", isAuthenticated, isAuthorized("Admin"), recordBorrowedBook);
router.get("/record-borrowed-books-all", isAuthenticated, isAuthorized("Admin"), recordBorrowedBookAdmin);
router.get("/my-books", isAuthenticated, borrowedBooks);
router.put("/return-book/:bookId", isAuthenticated, isAuthorized("Admin"), returnBorrowedBooks);

export default router;