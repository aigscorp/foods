let express = require('express');
let router = express.Router();
let inviteController = require('../controllers/inviteController');

router.get('/', inviteController.inviteList);
router.get('/detail/:id', inviteController.inviteDetail);

module.exports = router;