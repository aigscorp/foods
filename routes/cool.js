let express = require('express');
let router = express.Router();

router.get('/', function (req, res, next) {
   res.send("You are so cool!");
});
module.exports = router;