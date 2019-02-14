let express = require('express');
let router = express.Router();

let deliveryController = require('../controllers/deliveryController');

router.get('/deliveries', deliveryController.delivery_list);
router.get('/delivery/:id', deliveryController.delivery_detail);

module.exports = router;

