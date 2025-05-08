const mysql = require('mysql2');

//Create connection to Database
const db = mysql.createConnection({
    host: '192.168.43.10',
    user: 'boor',
    password: 'boorkick45',
    database: 'webplayermusic'
});

module.exports = db;