const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Live Balls' });
});

router.get('/getEnv', (req, res, next) => {
	const envData = require('../config/env.json')[process.env.NODE_ENV || 'development'];
	res.json(envData);
});

module.exports = router;
