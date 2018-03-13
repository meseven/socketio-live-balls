var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send("env:="+ process.env.NODE_ENV);
});

module.exports = router;
