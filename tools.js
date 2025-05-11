const fs = require('fs');

function writeLog(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}\n`;

    fs.appendFile('./server.log', logEntry, (err) => {
        if (err) {
            console.log('Failed to write log', err);
        }
    });
}

module.exports = writeLog;