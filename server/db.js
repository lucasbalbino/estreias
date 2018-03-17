const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'mysql472.umbler.com',
    user: 'user-api',
    password: 'g2eB#H2TOQ-',
    port: 41890,
    database: 'estreias_db'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
});

module.exports = connection;