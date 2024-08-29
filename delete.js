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

// Route to delete a review for a book by ISBN and reviewer's name
app.delete('/books/:isbn/reviews/:reviewer', (req, res) => {
    const isbn = req.params.isbn;
    const reviewer = req.params.reviewer;

    // Find the book
    const book = books.find(b => b.isbn === isbn);
    if (!book) {
        return res.status(404).json({ error: 'Book not found' });
    }

    // Find the index of the review by the specified reviewer
    const reviewIndex = book.reviews.findIndex(r => r.reviewer === reviewer);
    if (reviewIndex === -1) {
        return res.status(404).json({ error: 'Review not found' });
    }

    // Remove the review from the reviews array
    book.reviews.splice(reviewIndex, 1);

    // Send response indicating review has been deleted
    res.json({ message: 'Review deleted' });
});

// Middleware to handle 404 errors for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
