const db = require('../db');
const fs = require('fs');

let dashboard = {

    getDashboard: (req, res) => {
        fs.readFile('workspace/dashboard.json', 'utf8', (err, data) => {
            if (err) throw err;
            obj = JSON.parse(data);
            // setTimeout((function() {res.send(JSON.stringify(obj))}), 1000);
            res.send(JSON.stringify(obj));
        });
    }
};

module.exports = dashboard;