const express = require('express'); 
const pool = require('./dbconnection');
const app = express();
const auth = require('./api/auth');
const getdata = require('./api/getdata');

app.use(express.json());

app.use('/webplayermusic/account', auth);
app.use('/webplayermusic/data', getdata);

//Try connect to Database
pool.connect(err => {
    if (err) {
        console.log(`Failed to connect Database\n`, err);
        return;
    }
    console.log(`Success connected to Database`);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


