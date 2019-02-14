let express = require('express');
let router = express.Router();
let indexController = require('../controllers/indexController');

router.get('/', indexController.main);

// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Интернет-магазин продуктов' });
//   // res.redirect('/catalog');
// });

module.exports = router;
