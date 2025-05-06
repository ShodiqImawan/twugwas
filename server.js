const express = require('express');
const mysql = require('mysql2');
const crypto = require('crypto');
const app = express();

app.use(express.json());

//Create connection to Database
const db = mysql.createConnection({
    host: '192.168.43.10',
    user: 'boor',
    password: 'boorkick45',
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

//Route: Get all session_login
app.get('/webplayermusic/session_login', (req, res) => {
    db.query('SELECT * FROM session_login', (err, result) => {
        if(err) {
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

    const sqlCheck = 'SELECT * FROM account WHERE username = ? OR email = ?'

    db.query(sqlCheck, [username, email], (err, result) => {
        if (err) {
            return res.status(500).json({message: 'Server is trouble'});
        }

        if (result.length > 0) {
            return res.status(400).json({message: 'Username of Email already exists'});
        }

        const sql = 'INSERT INTO account (username, password, email) VALUES (?, ?, ?)';
    
        db.query(sql, [username, hashedPassword, email], (err, result) => {
            if (err) {
                return res.status(500).json({message: 'Failed to add account'});
            }

            res.status(200).json({
                message: 'Account successfully added',
                insertedId: result.insertId
            })
        })
    }) 
})

//Route: Login
app.post('/webplayermusic/login', (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(400).json({message: 'Email and password are required'});
    }

    //Enkripsi password dengan SHA256
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const sql = 'SELECT * FROM account WHERE email = ? AND password = ?';

    db.query(sql, [email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json({message: 'Server is trouble'});
        }

        if (result.length === 0) {
            return res.status(400).json({message: 'Invalid email or password'});
        }

        //Ambil data user yang login
        const user = result[0];
        
        //Check session token
        const sessionCheckToken = 'SELECT * FROM session_login WHERE account_id = ? AND expiry_time > ?';

        db.query(sessionCheckToken , [user.id, Date.now()], (err, sessionResult) => {
            if (err) {
                return res.status(500).json({message: 'Failed to check session, Server is trouble'}); 
            }

            if (sessionResult.length > 0) {
                const existingToken = sessionResult[0].session_token;

                return res.status(200).json({
                    message: 'Login successful',
                    sessionToken: existingToken,
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        type: user.type
                    }
                });
            }

            const deleteOldSessionToken = 'DELETE FROM session_login WHERE account_id = ?';

            db.query(deleteOldSessionToken, [user.id], (err) => {
                if (err) {
                    return res.status(500).json({message: 'Failed to delete expired session token, Server is trouble'});
                }
                
                //Generate session token
                const sessionToken = crypto.randomBytes(64).toString('hex');

                //Set expiry token untuk 24jam kedepan
                const expiryTime = Date.now() + 24 * 60 * 60 * 1000;

                //Simpan session token dan expiry time ke session_login
                const sessionSql = 'INSERT INTO session_login (account_id, session_token, expiry_time) VALUES (?, ?, ?)';

                db.query(sessionSql,  [user.id, sessionToken, expiryTime], (err, sessionResult) => {
                    if (err) {
                        return res.status(500).json({message: 'Failed to save session, Server is trouble'});
                    }

                    //Kirim response dengan session token dan data user
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
