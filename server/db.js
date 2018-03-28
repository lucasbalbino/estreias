const mysql = require('mysql');

const dbconfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    connectionLimit: 10,
    waitForConnections: true,
    wait_timeout: 28800,
    connect_timeout: 10
};

let connection = mysql.createPool(dbconfig);

connection.getConnection((err) => {
    if (err) {
        console.log("DB Not Connected!", err.code);
    } else {
        console.log('DB Connected!');
    }
});

connection.on('error', (err) => {
    console.log("DB Disconnected!", err.code);
    reconnect();
});

let interval;
function reconnect() {
    console.log('Retrying connection...');
    connection.getConnection((err) => {
        if (err) {
            console.log("DB Not Connected!", err.code);
            interval = setInterval(reconnect, 300);
        } else {
            console.log('DB Connected!');
            clearInterval(interval);
        }
    });
}

module.exports = connection;