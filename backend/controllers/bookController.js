import Book from '../models/Book.js';

export const createBook = async (req, res) => {
  try {
    const { title, author, subtitle, chapters, userId } = req.body;

    // basic validation
    if (!title || !author) {
      return res
        .status(400)
        .json({ message: 'Please provide a title and author' });
    }

    if (!userId) {
      return res
        .status(400)
        .json({ message: 'Please provide userId' });
    }

    const book = await Book.create({
      userId,   // required in your schema
      title,
      author,
      subtitle,
      chapters,
    });

    return res.status(201).json({
      message: 'Book created successfully',
      book,
    });
  } catch (error) {
    console.error('Create book error:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};





export const getBooks = async (req, res)=>{
    try {
        const books = await Book.find({userId: req.user._id}).sort({ createdAt: -1});
        res.status(200).json(books)
    } catch (error) {
        res.status(500).json({message:"Server error"})
    }
}

export const getBookById = async (req, res)=>{
    try {
        const book = await Book.findById(req.params.id);

        if(!book){
            return res.status(404).json({
                message:"Book not found"
            });
        }

        if(book.userId.toString() !== req.user._id.toString()){
            return res.status(401).json({message:"Not authorized to view this book"})
        }

        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({message:"Server error"})
    }
}

export const updateBook = async (req, res)=>{
    try {
        const book = await Book.findById(req.params.id);

        if(!book){
            return res.status(404).json({
                message:"Book not found"
            });
        }

        if(book.userId.toString() !== req.user._id.toString()){
            return res.status(401).json({message:"Not authorized to update this book"})
        }

       const updateBook = await Book.findByIdAndUpdate( req.params.id, req.body, {
        new:true,
       })
       res.status(200).json(updateBook);
    } catch (error) {
        res.status(500).json({message:"Server error"})
    }
}

export const deleteBook = async(req, res)=>{
    try {
        const book = await Book.findById(req.params.id);

        if(!book){
            return res.status(404).json({
                message:"Book not found"
            });
        }

        if(book.userId.toString() !== req.user._id.toString()){
            return res.status(401).json({message:"Not authorized to delete this book"})
        }
         
        await book.deleteOne();
        res.status(200).json({message:" Book Deleted successfully"})
        
    } catch (error) {
        res.status(500).json({message:"Server error"})
    }
}

export const updateBookCover = async ( req, res) =>{
    try {
        const book = await Book.findById(req.params.id);

        if(!book){
            return res.status(404).json({
                message:"Book not found"
            });
        }

        if(book.userId.toString() !== req.user._id.toString()){
            return res.status(401).json({message:"Not authorized to update this book"})
        }
        if(req.file){
            book.coverImage = `/${req.file.path}`;
        }else{
            return res.status(400).json({message:"No image file provided"})
        }

        const updateBook = await book.save();
        res.status(200).json(updateBook);

        
    } catch (error) {
        res.status(500).json({message:"Server error"})
    }
}
