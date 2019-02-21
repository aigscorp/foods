let Caucasus = require('../models/pool');

exports.caucasusList = async function(req, res){
  let basket = "";
  if(req.cookies.price !== undefined){
    basket = ' ' + req.cookies.count + ' / ' + req.cookies.price + ' руб.';
    console.log('basket: ', basket);
  }

  try {
    let results = await Caucasus.query("SELECT * FROM catalog WHERE category_id = 3");
    // console.log("result = ", results);
    let href = "/caucasus/detail/";
    res.render('listproduct', {title: "Интернет-магазин", menuname: "Меню на званный ужин", results: results, basket: basket, href: href});
  } catch (err) {
    throw new Error(err);
  }
  // res.status(200).send('Invite List');
};