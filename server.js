const express = require('express');
const app = express();
const port = 3000;

// Sample data: list of books
const books = [
    { id: 1, title: 'The Catcher in the Rye', author: 'J.D. Salinger' },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
    { id: 3, title: '1984', author: 'George Orwell' },
    { id: 4, title: 'Moby Dick', author: 'Herman Melville' },
    { id: 5, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' }
];

// Define a route to get the list of books
app.get('/books', (req, res) => {
    res.json(books);
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
