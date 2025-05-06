//Client for test API

const http = require('http');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

//Function pembuat soal
function ask (question, type = null) {
    return new Promise(resolve => {
        function prompt () {
            rl.question(`${question}=>`, (answer) =>{
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


async function main() {
    //Credit

    while (true) {
        const choice = await ask('Do you want to (login) or (register)? \n');

        if (choice.toLowerCase() === 'login') {
            console.log('\nYou chose to login.\n');
            // Panggil fungsi login nanti di sini
            break;
        } else if (choice.toLowerCase() === 'register') {
            console.log('\nYou chose to register.\n');
            // Panggil fungsi register nanti di sini
            break;
        } else {
            console.log('Please choose either "login" or "register".\n');
        }
    }

    rl.close();
}


main()