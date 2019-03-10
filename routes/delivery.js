let express = require('express');
let router = express.Router();

let deliveryController = require('../controllers/deliveryController');

router.get('/', deliveryController.delivery_list);
router.get('/detail/:id', deliveryController.delivery_detail);
router.post('/detail/*', deliveryController.delivery_detail_add);
module.exports = router;

