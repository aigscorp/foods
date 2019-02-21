let express = require('express');
let router = express.Router();
let caucasusController = require('../controllers/caucasusController');

router.get('/', caucasusController.caucasusList);

module.exports = router;