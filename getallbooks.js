const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // Middleware to parse JSON bodies

// Sample data: list of books (simulating an async data source)
const books = [
    { id: 1, title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '9780316769488' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780061120084' },
    { id: 3, title: '1984', author: 'George Orwell', isbn: '9780451524935' },
    { id: 4, title: 'Moby Dick', author: 'Herman Melville', isbn: '9781503280786' },
    { id: 5, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565' }
];

// Simulate an asynchronous function to get all books
const getBooksAsync = async () => {
    // Simulating a delay (e.g., database call)
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(books);
        }, 1000); // Simulating 1 second delay
    });
};

// Route to get all books
app.get('/books', async (req, res) => {
    try {
        const booksList = await getBooksAsync();
        res.json(booksList);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving books' });
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
