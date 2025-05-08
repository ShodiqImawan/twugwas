const express = require('express');
const crypto = require('crypto');
const db = require ('../db');
const router = express.Router();

//Route: Register
router.post('/register', (req, res) => {
    const {username, password, email} = req.body;

    if (!username || !password || !email) {
        return res.status(401).json({message: 'All forms must be filled out'})
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const sqlCheck = 'SELECT * FROM account WHERE username = ? OR email = ?'

    db.query(sqlCheck, [username, email], (err, result) => {
        if (err) {
            return res.status(500).json({message: 'Server is trouble'});
        }

        if (result.length > 0) {
            return res.status(401).json({message: 'Username of Email already exists'});
        }

        const sql = 'INSERT INTO account (username, password, email) VALUES (?, ?, ?)';
    
        db.query(sql, [username, hashedPassword, email], (err, result) => {
            if (err) {
                return res.status(500).json({message: 'Failed to add account'});
            }

            return res.status(201).json({
                message: 'Account successfully added',
                insertedId: result.insertId
            })
        })
    }) 
})

//Route: Login
router.post('/webplayermusic/account/login', (req, res) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return res.status(401).json({message: 'Email and password are required'});
    }

    //Enkripsi password dengan SHA256
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    const sql = 'SELECT * FROM account WHERE email = ? AND password = ?';

    db.query(sql, [email, hashedPassword], (err, result) => {
        if (err) {
            return res.status(500).json({message: 'Server is trouble'});
        }

        if (result.length === 0) {
            return res.status(401).json({message: 'Invalid email or password'});
        }

        //Ambil data user yang login
        const user = result[0];
        
        //Check session token
        const sessionCheck = 'SELECT * FROM session_login WHERE account_id = ?';

        db.query(sessionCheck, [user.id], (err, sessionResult) => {

            const newToken = crypto.randomBytes(64).toString('hex');
            const expiryTime = Date.now() + 24 * 60 * 60 * 1000;
            const sessionNew = 'INSERT INTO session_login (account_id, session_token, expiry_time) VALUES (?, ?, ?)';

            if (err) {
                return res.status(500).json({message: 'Failed to check session, Server is trouble'}); 
            }

            if (sessionResult.length === 0) {

                db.query(sessionNew, [user.id, newToken, expiryTime], (err) => {
                    if(err) {
                        return res.status(500).json({message: 'Failed to check session, Server is trouble'});
                    }

                    return res.status(201).json({
                        message:'Login successful',
                        sessionToken: newToken,
                        user: {
                            id: user.id,
                            username: user.username,
                            email: user.email,
                            type: user.type
                        }
                    });
                });
            }

            const sessionUser = sessionResult[0];

            if(sessionUser.expiry_time < Date.now()) {

                //Hapus sesi dan isi ulang dengan yang baru
                const deleteSession = 'DELETE FROM session_login WHERE account_id = ?';

                db.query(deleteSession, [user.id], (err, forResult) => {
                    if(err) {
                        return res.status(500).json({message: 'Failed to check session, Server is trouble'});
                    }

                    db.query(sessionNew, [user.id, newToken, expiryTime], (err) => {
                        if(err) {
                            return res.status(500).json({message: 'Failed to check session, Server is trouble'});
                        }

                        return res.status(201).json({
                            message:'Login successful',
                            sessionToken: newToken,
                            user: {
                                id: user.id,
                                username: user.username,
                                email: user.email,
                                type: user.type
                            }
                        });
                    })

                });
            }
            
            return res.status(201).json({
                message: 'Login successful',
                sessionToken: sessionUser.session_token,
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


module.exports = router;