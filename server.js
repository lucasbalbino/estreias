const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');

const app = express();
const port = process.env.PORT || 3000;

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

app.all('/api/*', function (req, res, next) {
    res.set('Cache-Control', 'public, max-age=86400, s-maxage=86400'); // 1 day
    res.setHeader("Expires", new Date(Date.now() + 86400000).toUTCString());
    next();
});

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(bodyParser.json());

app.use(compression());

app.use('/', require('./server/routes'));

let task = require('./server/scripts/scheduled-task');
task.startScheduledTask();

// let task = require('./server/scripts/task-movies');
// task.getMovie("cinema");

app.listen(port, () => console.log(`Listening on port ${port}`));