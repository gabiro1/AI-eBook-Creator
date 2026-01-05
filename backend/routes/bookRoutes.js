import express from 'express'
import {createBook, getBooks, getBookById, updateBook, deleteBook } from '../controllers/bookController.js'
import protect from '../middlewares/authMiddleware.js'
import upload from '../middlewares/uploadMiddleware.js'
import { updateBookCover } from '../controllers/bookController.js'

const router = express.Router();

router.use(protect);

router.route("/").post(createBook).get(getBooks)
router.route("/:id").get(getBookById).put(updateBook).delete(deleteBook);
router.route("/cover/:id").put(upload, updateBookCover);

export default router