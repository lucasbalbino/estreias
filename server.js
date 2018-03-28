const express = require('express');
const bodyParser = require('body-parser');

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

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(bodyParser.json());

app.use('/', require('./server/routes'));

app.listen(port, () => console.log(`Listening on port ${port}`));

let task = require('./server/scripts/scheduled-task');
task.startScheduledTask();