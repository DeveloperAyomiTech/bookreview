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

/*// Simulate an asynchronous function to find a book by ISBN using Promises
const findBookByIsbn = (isbn) => {
    return new Promise((resolve, reject) => {
        // Simulating a delay (e.g., database call)
        setTimeout(() => {
            const book = books.find(b => b.isbn === isbn);
            if (book) {
                resolve(book);
            } else {
                reject(new Error('Book not found'));
            }
        }, 1000); // Simulating 1 second delay
    });
};
*/
// Route to get a book by ISBN
app.get('/books/:isbn', (req, res) => {
    const isbn = req.params.isbn;

    findBookByIsbn(isbn)
        .then(book => {
            res.json(book);
        })
        .catch(error => {
            res.status(404).json({ error: error.message });
        });
});

// Middleware to handle 404 errors for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
