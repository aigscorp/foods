let Invite = require('../models/pool');

exports.inviteList = async function(req, res){
  let basket = "";
  if(req.cookies.price !== undefined){
    basket = ' ' + req.cookies.count + ' / ' + req.cookies.price + ' руб.';
    // console.log('basket: ', basket);
  }

  try {
    let results = await Invite.query("SELECT * FROM catalog WHERE category_id = 2");
    // let count = await Delivery.query("SELECT count(*) as cnt FROM catalog");
    // console.log("result = ", results);
    let href = "/invite/detail/";
    res.render('listproduct', {title: "Интернет-магазин", menuname: "Меню на званный ужин", results: results, basket: basket, href: href});
  } catch (err) {
    throw new Error(err);
  }
  // res.status(200).send('Invite List');
};

exports.inviteDetail = async function(req, res){
  console.log('REQUEST DETAIL:', req.cookies, req.body);
  let basket = "";
  if(req.cookies.price !== undefined){
    basket = ' ' + req.cookies.count + ' / ' + req.cookies.price + ' руб.';
    console.log('basket: ', basket);
  }
  try {
    let result = await Invite.query("SELECT * FROM catalog WHERE id = " + req.params.id);
    // console.log("Details: ", result);
    // res.send('NOT implemented: delivery detail: ' + result[0].text);

    result[0].path = '<p><img src=/img/' + result[0].path + '></p>';
    // "src=" + result[0].path;
    // console.log("detail img = ", result[0].path);
    // res.render('detail', {title: "Интернет-магазин", path: result[0].path, text: result[0].text});
    res.render('detail', {title: "Интернет-магазин", path: result[0].path, text: result[0].text, menuname: result[0].header, price: result[0].price, basket: basket, id: result[0].id});
  } catch(err){
    throw new Error(err);
  }

};