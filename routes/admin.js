let express = require('express');
let busboyBody = require('busboy-body-parser');
let router = express.Router();
let adminController = require('../controllers/adminController');

router.get('/panel/admin', adminController.main);
router.put('/panel/admin', busboyBody(), adminController.add);
router.post('/panel/admin', adminController.search);
router.post('/panel/admin/update', busboyBody(), adminController.update);

module.exports = router;