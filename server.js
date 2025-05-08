const express = require('express'); 
const crypto = require('crypto');
const db = require('./db');
const app = express();

app.use(express.json());

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


const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


