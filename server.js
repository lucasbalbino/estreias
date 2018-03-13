const express = require('express');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 5000;

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

app.all('/*', function (req, res, next) {
    // CORS headers
    res.header('Access-Control-Allow-Origin', '*'); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
    if (req.method === 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

app.use('/', require('./server/routes'));

app.listen(port, () => console.log(`Listening on port ${port}`));