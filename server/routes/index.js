const express = require('express');
const path = require('path');
const router = express.Router();

const estreias = require('./estreias');
const list = require('./list');
const dashboard = require('./dashboard');
const form = require('./form');

router.get('*', (req, res, next) => {
    // checa se o header é HTTP ou HTTPS
    if (req.headers['x-forwarded-proto'] !== 'https') {
        // faz o redirect para HTTPS
        res.redirect("https://" + req.headers.host + req.url);
    } else {
        // segue com a sequência das rotas
        next();
    }
});

router.get('/api/dashboard', dashboard.getResumo);

router.get('/api/estreias/:type/:date', estreias.getEstreias);

router.get('/api/genres', list.getGenre);
router.get('/api/country', list.getCountry);
router.get('/api/distribution', list.getDistribution);

router.post('/api/contato', form.postDadosContato);


router.use(express.static(path.join(__dirname, '../../client/build')));

router.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

module.exports = router;