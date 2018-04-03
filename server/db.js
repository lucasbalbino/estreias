const mysql = require('mysql');

const dbconfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    connectionLimit: 20,
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
    // reconnect(connection);
});

let interval, heartbeat;
// function reconnect(con) {
//     console.log('Retrying connection...');
//     con.getConnection((err) => {
//         if (err) {//
//             console.log("DB Not Connected!", err.code);
//             interval = setInterval(reconnect(con), 3000);
//         } else {
//             console.log('DB Connected!');
//             clearInterval(interval);
//         }
//     });
// }

heartbeat = setInterval(() => {
    connection.query('SELECT 1', (err, result) => {
        if (err) {
            console.log("DB Not Connected!", err.code);
            // reconnect(connection);
        }
    });
}, 3000);

module.exports = connection;