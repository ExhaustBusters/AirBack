var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/data', function(req, res, next) {
  res.send({sensorid:'superid'});
});

module.exports = router;
