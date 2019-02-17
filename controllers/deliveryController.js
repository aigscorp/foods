let Delivery = require('../models/pool');

// let category = ['delivery', 'invite', 'weekly', 'newyear'];

exports.delivery_list = async function (req, res) {
  // console.log('\nsending data 1');
  let basket = "";
   if(req.cookies.price !== undefined){
     basket = ' ' + req.cookies.count + ' / ' + req.cookies.price + ' руб.';
    //  console.log('basket: ', basket);
   }

  try {
    let results = await Delivery.query("SELECT * FROM catalog WHERE category_id = 1");
    // let count = await Delivery.query("SELECT count(*) as cnt FROM catalog");
    // console.log("result = ", results);
    let href = "/delivery/detail/";
    res.render('listproduct', {title: "Интернет-магазин", menuname: "Меню на неделю", results: results, basket: basket, href:href});
  } catch (err) {
     throw new Error(err);
  } 

};


exports.delivery_detail = async function (req, res) {
  // console.log(req);
  try {
    let result = await Delivery.query("SELECT * FROM catalog WHERE id = " + req.params.id);
    // console.log("Details: ", result);
    // res.send('NOT implemented: delivery detail: ' + result[0].text);
    
    result[0].path = '<img src=/img/' + result[0].path + '>';
    // "src=" + result[0].path;
    console.log("detail img = ", result[0].path);
    res.render('detail', {title: "Интернет-магазин", path: result[0].path, text: result[0].text, menuname: result[0].header, price: result[0].price});
  } catch(err){
    throw new Error(err);
  }
};