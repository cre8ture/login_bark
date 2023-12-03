const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('./middleware/middleware');
const cookieParser = require('cookie-parser');

const port = process.env.PORT || 3000;

const app = express();

// middleware
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

dotenv.config({ path: './.env' });

const publicDir = path.join(__dirname, './views');
app.use(express.static(publicDir));

const publicCss = path.join(__dirname, './public');
app.use(express.static(publicCss));

const db = mysql.createConnection({
  host: process.env.RDS_HOSTNAME,
  user: process.env.RDS_USERNAME,
  password: process.env.RDS_PASSWORD,
//   database: process.env.RDS_DB_NAME,
});

db.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('MySQL connected!');
    createDatabaseAndTable();
  }
});

function createDatabaseAndTable() {
  const dbName = process.env.RDS_DB_NAME;

  db.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``, (err) => {
    if (err) {
      console.log('Error creating database:', err);
    } else {
      console.log(`Database "${dbName}" created or already exists.`);
      db.query(`USE \`${dbName}\``, (err) => {
        if (err) {
          console.log('Error selecting database:', err);
        } else {
          console.log(`Using database "${dbName}".`);
          createUsersTable();
        }
      });
    }
  });
}

function createUsersTable() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      email VARCHAR(255),
      password VARCHAR(255)
    );
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.log('Error creating users table:', err);
    } else {
      console.log('Users table created or already exists.');
    }
  });
}



app.get('/', (req, res) => {
    res.render('index')
});

app.get('/register', (req, res) => {
    res.render("register")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.get('/check-email', (req, res) => {
    const email = req.query.email;

    // Query your database to check if the email exists
    db.query('SELECT email FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            // Handle error
            res.send('Error occurred');
            return;
        }

        if (result.length > 0) {
            res.send('Email is already in use');
        } else {
            res.send(''); // No message if email is not found
        }
    });
});

app.post("/auth/register", async (req, res) => {
    const { name, email, password, password_confirm } = req.body;

    // Email validation (basic example)
    if (!email.match(/^\S+@\S+\.\S+$/)) {
        return res.render('register', {
            message: 'Please enter a valid email address.'
        });
    }

    // Password validation
    const passwordErrors = [];
    if (password.length < 8) {
        passwordErrors.push("Password must be at least 8 characters.");
    }
    if (!password.match(/[A-Z]/)) {
        passwordErrors.push("Password must include at least one uppercase letter.");
    }
    if (!password.match(/[^a-zA-Z\d]/)) {
        passwordErrors.push("Password must include at least one non-alphanumeric character.");
    }
    if (password !== password_confirm) {
        passwordErrors.push("Passwords do not match.");
    }

    if (passwordErrors.length > 0) {
        return res.render('register', {
            message: passwordErrors.join(' ')
        });
    }

    // Check if email already exists
    db.query('SELECT email FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.log(err);
            return res.render('register', {
                message: 'Database error'
            });
        }

        if (results.length > 0) {
            return res.render('register', {
                message: 'This email is already in use'
            });
        }

        // Proceed with registration as email is unique
        let hashedPassword = await bcrypt.hash(password, 8);
        db.query('INSERT INTO users SET ?', { name: name, email: email, password: hashedPassword }, (error, result) => {
            // Handle possible errors during insert
            if (error) {
                console.error(error);
                return res.render('register', {
                    message: 'Database error during registration'
                });
            }

            // If no error, registration is successful
            const userId = result.insertId; // Getting the user's ID

            const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });

            // Send the token to the client
            res.cookie('jwt', token, {
                expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                httpOnly: true
            });

            // Redirect or send a response as required
            console.log("Registration successful", result);
            res.redirect('/someProtectedRoute');
        });
    });
});

app.get('/someProtectedRoute', verifyToken, (req, res) => {
    // Your route logic
    return res.render('someProtectedRoute', {
    })
});

app.post('/logout', (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 }); // Clear the JWT cookie
    res.redirect('/');
});



app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(401).render('login', {
            message: 'Email or Password is incorrect'
        });
        
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) {
            console.log(err);
        }

        // Check if user exists
        if (results.length === 0) {
            return res.status(401).render('login', {
                message: 'Email or Password is incorrect'
            });
        }

        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, results[0].password);
        if (!isPasswordCorrect) {
            return res.status(401).render('login', {
                message: 'Email or Password is incorrect'
            });
        }

        // User exists and password is correct
        const id = results[0].id;
        const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        });

        res.cookie('jwt', token, {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
            httpOnly: true
        });

        res.status(200).redirect('/someProtectedRoute');
    });
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
