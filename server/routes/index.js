const express = require('express');
const path = require('path');
const router = express.Router();

const estreias = require('./estreias');
const list = require('./list');
const dashboard = require('./dashboard');

router.get('/api/dashboard', dashboard.getResumo);

router.get('/api/estreias/:type/:date', estreias.getEstreias);

router.get('/api/genres', list.getGenre);
router.get('/api/country', list.getCountry);
router.get('/api/distribution', list.getDistribution);



router.use(express.static(path.join(__dirname, '../../client/build')));

router.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../../client/build', 'index.html'));
});

module.exports = router;