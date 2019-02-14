let express = require('express');
let router = express.Router();
let checkController = require('../controllers/checkController');

router.get('/check', checkController.checkout);
router.post('/check', checkController.checkupdate);
router.get('/check/order', checkController.checkorder);
router.post('/check/order', checkController.checkorder);
module.exports = router;