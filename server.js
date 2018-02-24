const express = require('express');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 5000;

app.get('/api/hello', (req, res) => {
    res.send({express: 'Hello From Express'});
});

app.get('/type/:type', (req, res) => {
    let type = req.params.type;
    console.log(type);
    fs.readFile(type + '.json', 'utf8', (err, data) => {
        if (err) throw err;
        obj = JSON.parse(data);
        // setTimeout((function() {res.send(JSON.stringify(obj))}), 5000);
        res.send(JSON.stringify(obj));
    });
});

app.listen(port, () => console.log(`Listening on port ${port}`));