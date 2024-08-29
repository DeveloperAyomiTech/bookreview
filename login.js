const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json()); // Middleware to parse JSON bodies

// Set up session management
app.use(session({
    secret: 'your-secret-key', // Replace with a strong secret key
    resave: false,
    saveUninitialized: true
}));

// In-memory user storage (for demonstration purposes)
const users = [];

// Route to register a new user
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if user already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }

    // Hash the password
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Save new user
        const newUser = { username, password: hashedPassword };
        users.push(newUser);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error registering user' });
    }
});

// Route to login a user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Basic validation
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if user exists
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Verify the password
    try {
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            req.session.user = { username: user.username }; // Store user in session
            res.json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'nvalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error logging in' });
    }
});

// Route to check if user is logged in
app.get('/me', (req, res) => {
    if (req.session.user) {
        res.json({ username: req.session.user.username });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});

// Route to logout a user
app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Error logging out' });
        }
        res.json({ message: 'Logout successful' });
    });
});

// Route to list all users (for demonstration purposes)
app.get('/users', (req, res) => {
    res.json(users.map(user => ({ username: user.username })));
});

// Middleware to handle 404 errors for undefined routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
