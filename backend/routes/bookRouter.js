import { addBook, allBook, deleteBook } from "../controllers/books.controller.js";
import { isAuthenticated, isAuthorized } from "../middlewares/authMiddleware.js";
import express from "express";

const router = express.Router();

router.post("/admin/add", isAuthenticated, isAuthorized("Admin"), addBook);
router.get("/all", isAuthenticated, allBook);
router.delete("/delete/:id",isAuthenticated, isAuthorized("Admin") , deleteBook);

export default router;