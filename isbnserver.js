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

// Define a route to get the list of books
app.get('/books', (req, res) => {
    res.json(books);
});

// Define a route to get a book by ISBN
app.get('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn;
    const book = books.find(b => b.isbn === isbn);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

// Define a route to get books by author
app.get('/books/author/:author', (req, res) => {
    const author = req.params.author.toLowerCase();
    const filteredBooks = books.filter(b => b.author.toLowerCase() === author);
    if (filteredBooks.length > 0) {
        res.json(filteredBooks);
    } else {
        res.status(404).json({ error: 'No books found by this author' });
    }
});

// Define a route to search books by title
app.get('/books/title/:title', (req, res) => {
    const title = req.params.title.toLowerCase();
    const filteredBooks = books.filter(b => b.title.toLowerCase().includes(title));
    if (filteredBooks.length > 0) {
        res.json(filteredBooks);
    } else {
        res.status(404).json({ error: 'No books found with this title' });
    }
});

// Define a route to get reviews for a book by ISBN
app.get('/books/:isbn/reviews', (req, res) => {
    const isbn = req.params.isbn;
    const book = books.find(b => b.isbn === isbn);
    if (book) {
        res.json(book.reviews);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

// Define a route to add a review for a book by ISBN
app.post('/books/:isbn/reviews', (req, res) => {
    const isbn = req.params.isbn;
    const { reviewer, rating, comment } = req.body;
    
    // Basic validation
    if (!reviewer || typeof rating !== 'number' || rating < 1 || rating > 5 || !comment) {
        return res.status(400).json({ error: 'Invalid review data' });
    }

    const book = books.find(b => b.isbn === isbn);
    if (book) {
        const newReview = { reviewer, rating, comment };
        book.reviews.push(newReview);
        res.status(201).json(newReview);
    } else {
        res.status(404).json({ error: 'Book not found' });
    }
});

// Middleware to handle 404 errors for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
