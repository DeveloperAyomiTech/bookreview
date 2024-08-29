const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Sample data: list of books with reviews
const books = [
    { id: 1, title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '9780316769488', reviews: [
        { reviewer: 'Alice', rating: 4, comment: 'A compelling read with deep characters.' },
        { reviewer: 'Bob', rating: 3, comment: 'Interesting but somewhat overrated.' }
    ] },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780061120084', reviews: [
        { reviewer: 'Carol', rating: 5, comment: 'A masterpiece of modern literature.' }
    ] },
    { id: 3, title: '1984', author: 'George Orwell', isbn: '9780451524935', reviews: [
        { reviewer: 'Dave', rating: 4, comment: 'A thought-provoking dystopian novel.' }
    ] },
    // More books...
];

// Route to get a book by ISBN
app.get('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books.find(b => b.isbn === isbn);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

// Route to get reviews for a book by ISBN
app.get('/books/:isbn/reviews', (req, res) => {
    const isbn = req.params.isbn;
    const book = books.find(b => b.isbn === isbn);
    if (book) {
        res.json(book.reviews);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

// Route to update a review for a book by ISBN and reviewer's name
app.put('/books/:isbn/reviews/:reviewer', (req, res) => {
    const isbn = req.params.isbn;
    const reviewer = req.params.reviewer;
    const { rating, comment } = req.body;

    // Basic validation
    /*if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ error: 'Invalid rating. Rating must be a number between 1 and 5.' });
    }

    if (!comment || typeof comment !== 'string' || comment.trim() === '') {
        return res.status(400).json({ error: 'Invalid comment. Comment cannot be empty.' });
    }*/

    // Find the book
    const book = books.find(b => b.isbn === isbn);
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    // Find the review
    const review = book.reviews.find(r => r.reviewer === reviewer);
    if (!review) {
        return res.status(404).json({ error: 'Review not found' });
    }

    // Update the review
    review.rating = rating;
    review.comment = comment;

    // Send response indicating review updated
    res.json({ message: 'Review updated', review });
});

// Middleware to handle 404 errors for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
