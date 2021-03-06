let Check = require('../models/pool');
let checks = require('../util/cookies');

exports.checkout = async function (req, res) {
  try{
    let results = await Check.query("SELECT * FROM catalog");
    let res_count = results.length;
    // let back = checks.checkcook(results, res_count, arr);
    let str_uid = req.cookies.uid;
    console.log("str_uid = ", str_uid, req.cookies.price, req.cookies.count);
    let back = checks.checkcookie(results, res_count, str_uid);
    let reply = {count: req.cookies.count, uid: str_uid, price: req.cookies.price};

    res.status(200).render('check', {title: 'Интернет-магазин', results: back, reply: JSON.stringify(reply)});
    // res.status(200).send('Update');
  }catch (e) {
    throw new Error(e);
  }
};

exports.checkupdate = async function (req, res) {
  try {
    let results = await Check.query("SELECT * FROM catalog");
    let res_count = results.length;
    // console.log('CALL check update _____________________________\n');
    // console.log("req.body = ", req.body);

    for(let key in req.body){
      if(!Array.isArray(req.body[key])){
        let tmp = [];
        tmp.push(req.body[key]);
        req.body[key] = tmp;
      }
    }
    // console.log("req.body after = ", req.body);
    let id = req.body.id;
    let count = req.body.count;
    let del = req.body.del;

    // console.log("del = ", del);

    let str_uid = req.cookies.uid;
    // console.log("str_uid = ", str_uid);
    let back = checks.checkcookie(results, res_count, str_uid);

    console.log('id = ', id);
    let len = back.length;
    for(let i = 0; i < len; i++){
      for(let j = 0; j < id.length; j++){
        let pair = id[j].split(':');
        if(+pair[0] == back[i].id){
          if(+count[j] != +pair[1]){
            // console.log('count cook =', count[j], " pair[1]=", pair[1]);
            // let a = +count[j];
            // console.log('type a:',  typeof (a));
            back[i].count = +count[j];
          }
          // break;
        }
      }
    }

    // console.log('back = ', back);

    if(del != undefined) {
      for (let i = 0; i < del.length; i++) {
        for (let j = 0; j < back.length; j++) {
          // console.log('j = ', j);
          if (back[j].id == +del[i]) {
            back.splice(j, 1);
            // console.log('Удалено ');
            // console.log('del back =', back);

          }
        }
      }
    }

    let uid1 = "";
    for(let i = 0; i < back.length; i++){
      uid1 = uid1 + "id:" + back[i].id + ",count:" + back[i].count + "|";
    }
    // console.log("uid1 = ", uid1);
    let uid = uid1.substr(0, uid1.length - 1);
    // console.log("uid = ", uid);
    // let uid = arr.length ? "" : arr.join('|') + '|';
    // console.log('uid=', uid);

    // let back = checks.checkcook(results, res_count, arr);

    let price = back.reduce(function (sum, index) {
      return sum + index.price * index.count;
    }, 0);
    let allcount = back.reduce(function(cnt, index){
      return cnt + index.count;
    }, 0);

    let reply = {count: allcount, uid: uid, price: price};
    console.log("back = ", back);
    // res.status(200).json({id: reply});
    res.status(200).render('check', {title: 'Интернет-магазин', results: back, reply: JSON.stringify(reply)});

  }catch(e){
    throw new Error(e);
  }

  // res.status(200).send('<h2>Update</h2>');
};

exports.checkorder = async function (req, res) {

  let order_cookie = checks.parsing(req.cookies.uid, "|", ",");
  len = order_cookie.length;
  // console.log("order_cookies=", order_cookie);
  let str = "(";
  for(let i = 0; i < len; i++){
    str = (len - 1 == i) ? str + order_cookie[i].id : str + order_cookie[i].id + ","; 
  }
  str += ")";
  try {
    let qry = "SELECT @i:=@i+1 as num, cat.id, cat.category_id, cat.path, cat.header, cat.price FROM catalog as cat, (select @i:=0) as r WHERE id IN ";
    // let results = await Check.query("SELECT id, category_id, path, header, price FROM catalog WHERE id IN " + str);
    let results = await Check.query(qry + str);
    let order_num = await Check.query("SELECT max(ordernum) as order_num FROM orders");
    let ordernum = (order_num[0].order_num == null) ? order_num[0].order_num = 0 : order_num[0].order_num;
    ordernum++;
    let format_ordernum = '0'.repeat(5 - (ordernum.toString()).length) + ordernum;
    
    for(let i = 0; i < results.length; i++){
      for(let j = 0; j < len; j++){
        if(results[i].id == order_cookie[j].id){
          results[i].count = order_cookie[j].count;
          results[i].path = '/img/' + results[i].path;
          break;
        }
      }
    }

    // console.log("results = ", results);
    // console.log("order_num = ", ordernum, order_num[0].order_num);
    
    let ins = "";
    let date = new Date();
    date = date.getUTCFullYear() + '-' +
        ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
        ('00' + date.getUTCDate()).slice(-2) + ' ' + 
        ('00' + date.getUTCHours()).slice(-2) + ':' + 
        ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
        ('00' + date.getUTCSeconds()).slice(-2);
    // console.log('date = ', date);
    date = "'" + date + "'";
    for(let i = 0; i < len; i++){
      if(len - 1 == i){
        ins = ins + "(" + ordernum + "," + order_cookie[i].id + "," + order_cookie[i].count + "," + date + ")";
      }else{
        ins = ins + "(" + ordernum + "," + order_cookie[i].id + "," + order_cookie[i].count + "," + date + "),";
      }
      
    }
    // console.log("ins = ", ins);
    // console.log("body = ", req.body);
    let addr = (req.body.address).trim();
    let phone = (req.body.phone).trim();
    let full_addr = "(" + ordernum + "," + "'" + addr + "'" + "," + "'" + phone + "'" + ")";
    
    // console.log("full =", full_addr);
    try {
      await Check.query("INSERT INTO orders (ordernum, food_id, counter, addtime) VALUES" + ins);
      await Check.query("INSERT INTO contact (ordernum, address, phone) VALUES" + full_addr);
    }catch(e){
      throw new Error(e);
    }
    let allprice = req.cookies.price;
    res.clearCookie('price');
    res.clearCookie('uid');
    res.clearCookie('count');
    res.status(200).render('order', {title: 'Интернет-магазин', results: results, ordernum: format_ordernum, 
                            allprice: allprice, addr: addr, phone: phone, date: date});
  }catch(err){
    throw new Error(err); 
  }
  
  // res.status(200).send(str);
};