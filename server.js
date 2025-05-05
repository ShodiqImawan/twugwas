const express = require('express');
const mysql = require('mysql2');
const crypto = require('crypto');
const app = express();

app.use(express.json());

//Create connection to Database
const db = mysql.createConnection({
    host: 'ip adress',
    user: 'root',
    password: '',
    database: 'webplayermusic'
});

//Try connect to Database
db.connect(err => {
    if (err) {
        console.log(`Failed to connect Database\n`, err);
        return;
    }
    console.log(`Success connected to Database`);
});

//Route: Get all account
app.get('/webplayermusic/account', (req, res) => {
    db.query('SELECT * FROM account', (err, result) => {
        if (err) {
            return res.status(500).json({message: 'Server is trouble'});
        }

        res.json(result);
    });
});

//Route: Register
app.post('/webplayermusic/account/register', (req, res) => {
    const {username, password, email} = req.body;

    if (!username || !password || !email) {
        return res.status(400).json({message: 'All forms must be filled out'})
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const sql = 'INSERT INTO account (username, password, email) VALUES (?, ?, ?)';
    
    db.query(sql, [username, hashedPassword, email], (err, result) => {
        if (err) {
            return res.status(500).json({message: 'Failed to add account'});
        }

        res.status(200).json({
            message: 'Account successfully added',
            insertedId: result.insertedId
        })
    }) 
})

//Route: Login
app.post('/webplayermusic/login', (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({message: 'Email and password are required'});
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const sql = 'SELECT * FROM account WHERE email = ? AND password = ?';

    db.query(sql, [email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json({message: 'Server is trouble'});
        }

        if (result.length === 0) {
            return res.status(400).json({message: 'Invalid email or password'});
        }

        const user = result[0];
        const sessionToken = crypto.randomBytes(64).toString('hex');
        const sessionSql = 'INSERT INTO session_login (account_id, session_token) VALUES (?, ?)';

        db.query(sessionSql, [user.id, sessionToken], (err, sessionResult) => {
            if (err) {
                return res.status(500).json({message: 'Failed to save session, Server is trouble'});
            }

            res.status(200).json({
                message: 'Login successful',
                sessionToken: sessionToken,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    type: user.type
                }
            });
        });
    });
});

//Route: Edit username account

//Route: Edit password account

//Route: Edit email account

//Route: Delete account







const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
