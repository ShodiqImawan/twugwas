const express = require('express'); 
const ws = require('ws');
const fs = require('fs');
const http = require('http');
const writeLog = require('./tools');
const pool = require('./dbconnection');
const app = express();
const auth = require('./api/auth');
const getdata = require('./api/getdata');

const server = http.createServer(app);
const wss = new ws.Server({server});

let clients = [];

app.use(express.json());

app.use('/webplayermusic/account', auth);
app.use('/webplayermusic/data', getdata);


//Untuk maintenance
const maintenanceHour = 3 //Jam 03:00 dini hari

setInterval(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    if (currentHour === 2 && currentMinute === 45) {
        //Berikan pesan ke client yang sedang terhubung ke server
        clients.forEach(client => {
            if(client.readyState === ws.OPEN) {
                client.send(JSON.stringify({
                    type: 'info',
                    message: 'Server maintenance will start at 03:00 server time, please stop your activities for a while'
                }));
            }
        });
    }

    if (currentHour === maintenanceHour && currentMinute ===0) {
        //Kirim pesan ke client dan katakan ke mereka bahwa server sedang Maintenance
        clients.forEach(client => {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify({
                    type: 'warning',
                    message: 'Server is under maintenance, please wait a few minutes'
                }));
            }
        });
        
        //Lakukan TRUNCATE pada session_login dan berikan pesan ke client jika berhasil dan berikan pesan bahwa server mengalami masalah jika error
        pool.query('TRUNCATE TABLE session_login', (err) => {
            if (err) {
                //Tulis lo ke sebuah file bahwa ini gagal dan bermasalah
                writeLog('Failed to TRUNCATE session_login');
            }

            //Tulis log ke sebuah file bahwa ini berhasil
            writeLog('Success to TRUNCATE session_login');
        })
    } 
}, 60 * 1000) //Cek setiap 1 menit


//Try connect to Database
pool.connect(err => {
    if (err) {
        console.log(`Failed to connect Database\n`, err);
        return;
    }
    console.log(`Success connected to Database`);
});


//Buat koneksi
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

//Cek koneksi client dan mendaftarkan nya
wss.on('connection', (socket) => {
    console.log('A client connected');

    clients.push(socket);

    socket.on('close', () => {
        console.log('A client disconnected');
        clients = clients.filter(s = s !== socket);
    })
})


