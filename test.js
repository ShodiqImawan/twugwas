//Client for test API

const http = require('http');
const { hostname } = require('os');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}


//Fungsi pembuat soal
function ask (question, type = null) {
    return new Promise(resolve => {
        function prompt () {
            rl.question(`${question}=> `, (answer) =>{
                if (answer.length == 0) {
                    console.log(`\nSorry, you must be filled this question`);
                    return prompt()
                }

                if (type === 'email') {
                    const checkEmail = validateEmail(answer);
                    if (checkEmail === false) {
                        console.log(`\nYour Email not valid, please try again`);
                        return prompt();
                    }
                }
                
                resolve(answer);
            });
        };
        
        prompt();
    });
}




//Fungsi panggil API
function sendRequest(path, data, method) {
    return new Promise((resolve, reject) => {
        const dataStr = JSON.stringify(data);
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(dataStr)
            }
        };

        const req = http.request(options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    const parsed = JSON.parse(responseData);
                    resolve(parsed);
                } catch(err) {
                    resolve(responseData);
                }
            });
        });
        
        req.on('error', (e) => {
            reject(e);
        });

        req.write(dataStr);
        req.end();
        
    });
}


//Register
async function register() {
    console.log('\n=== REGISTER ===\n');
    
    const username = await ask('Enter your username: ');
    const email = await ask('Enter your email: ', 'email');
    const password = await ask('Enter your password: ');
    
    try {
        const response = await sendRequest('/webplayermusic/account/register', {
            username,
            email,
            password
        }, 'POST');

        console.log(`\n[Server Response] ${response.message}`);
    } catch(error) {
        console.error('\nFailed to register: ', error.message || error);
    }
}


// Login
async function login() {
    console.log('\n=== LOGIN ===\n');

    const email = await ask('Enter your email: ', 'email');
    const password = await ask('Enter your password: ');

    try {
        const response = await sendRequest('/webplayermusic/account/login', {
            email,
            password
        }, 'POST');
        
        console.log(`\n[Server Response] ${response.message}`);
        // Tambahkan logika lanjutan jika login sukses, misal menyimpan token
    } catch(error) {
        console.error('\nFailed to login: ', error.message || error);
    }
}

//Play Music
async function playMusic() {
    
}

//Fungsi utama yang akan di jalankan
async function main() {
    while (true) {
        const choice = await ask('Do you want to (login) or (register)? \n');

        if (choice.toLowerCase() === 'login') {
            console.log('\nYou chose to login.\n');
            // Panggil fungsi login
            await login();
            break;
        } else if (choice.toLowerCase() === 'register') {
            // Panggil fungsi register
            await register();
            break;
        } else {
            console.log('Please choose either "login" or "register".\n');
        }
    }

    rl.close();
}


main();