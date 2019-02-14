var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/about', function (req, res, next) {
  res.send("POST.... You're so cool");
});
router.post('/', function (req, res) {
  res.send("THIS IS POST");
});
module.exports = router;
