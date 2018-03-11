const express = require('express');
const fs = require('fs');
const router = express.Router();

router.get('/api/dashboard', (req, res) => {
    fs.readFile('dashboard.json', 'utf8', (err, data) => {
        if (err) throw err;
        obj = JSON.parse(data);
        // setTimeout((function() {res.send(JSON.stringify(obj))}), 5000);
        res.send(JSON.stringify(obj));
    });
});

router.get('/api/estreias/:type/:date', (req, res) => {
    let type = req.params.type;
    let date = req.params.date;
    console.log(type, date);

    fs.readFile(type + '.json', 'utf8', (err, data) => {
        if (err) throw err;
        obj = JSON.parse(data);
        // setTimeout((function() {res.send(JSON.stringify(obj))}), 5000);
        res.send(JSON.stringify(obj));
    });
});

module.exports = router;