const express = require('express');
const pool = require ('../dbconnection');
const router = express.Router();


//Route: Get all account
router.get('/account', (req, res) => {
    pool.query('SELECT * FROM account', (err, result) => {
        if (err) {
            return res.status(500).json({message: 'Server is trouble'});
        }

        res.json(result);
    });
});

//Route: Get all session_login
router.get('/session_login', (req, res) => {
    pool.query('SELECT * FROM session_login', (err, result) => {
        if(err) {
            return res.status(500).json({message: 'Server is trouble'});
        }

        res.json(result);
    });
});

module.exports = router;