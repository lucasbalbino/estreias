const db = require('../db');

let list = {

    getGenre: (req, res) => {
        db.query('SELECT * FROM genre', (err, result) => {
            if (err) throw err;

            res.send(result);
        });
    },

    getCountry: (req, res) => {
        db.query('SELECT * FROM country', (err, result) => {
            if (err) throw err;

            res.send(result);
        });
    },

    getDistribution: (req, res) => {
        db.query('SELECT * FROM distribution', (err, result) => {
            if (err) throw err;

            res.send(result);
        });
    }
};

module.exports = list;