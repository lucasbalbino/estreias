const express = require('express');
const router = express.Router();

const estreias = require('./estreias');
const list = require('./list');
const dashboard = require('./dashboard');

router.get('/api/dashboard', dashboard.getResumo);

router.get('/api/estreias/:type/:date', estreias.getEstreias);

router.get('/api/genres', list.getGenre);
router.get('/api/country', list.getCountry);
router.get('/api/distribution', list.getDistribution);

module.exports = router;