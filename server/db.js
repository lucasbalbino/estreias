const mysql = require('mysql');

const dbconfig = {
    host: 'mysql472.umbler.com',
    user: 'user-api',
    password: 'g2eB#H2TOQ-',
    port: 3306,
    database: 'estreias_db'
};

let connection = mysql.createConnection(dbconfig);

connection.connect((err) => {
    if (err) {
        console.log("DB Disconnected!", err.code);
    }
    console.log('DB Connected!');
});

connection.on('error', (err) => {
    console.log("DB Disconnected!", err.code);
});

let interval = setInterval(function () {
    connection.query('SELECT 1', (err, results) => {
        if (err) {
            console.log("DB Disconnected!", err.code);
            clearInterval(interval);
        }
    });
}, 3000);

module.exports = connection;