let Main = require('../models/pool');
let template = require('../util/template');


let category = ['delivery', 'invite', 'weekly', 'newyear'];

exports.main = async function (req, res) {
   // console.log('%c', 'background: #222; color: red;', 'main page');
   console.info('main page');
   let limit = 6;
   let limits = "0, " + limit;
   // let pages1 = {
   //   pages: [1,2,3,4],
   //   active: ['active', '', '','']
   // };
   let pages = [1,2,3,4];
   let active = ['active', '', '',''];
   // console.log("Cookies:", req.cookies.count);
   let basket = "";
   if(req.cookies.price !== undefined){
     basket = ' ' + req.cookies.count + ' / ' + req.cookies.price + ' руб.';
     // console.log('basket: ', basket);
   }
   if(req.cookies.pag !== undefined){
     let strpag = req.cookies.pag.split('|');
     pages = strpag[0].split(',');
     pages.shift();
     pages.pop();
     for(let i = 0; i < pages.length; i++){
       pages[i] = +pages[i];
     }
     let pag = strpag[1].split(',');
     let direction = pag[0];
     let num_page = +pag[1];

     if(direction == "prev"){
       if(num_page > 1) num_page--;
       let min = Math.min.apply(null, pages);
       if(min > num_page){
         for(let i = 0; i < pages.length; i++){
           pages[i]--;
         }
       }
     }else if(direction == "next"){
       num_page++;
       let max = Math.max.apply(null, pages);
       if(num_page > max){
         for(let i = 0; i < pages.length; i++){
           pages[i]++;
         }
       }
     }else {
       num_page = +direction;
     }
     // console.log('direction = ', direction);
     // console.log('num_page = ', num_page);
     let counts = 12;
     for(let i = 0; i < pages.length; i++){
       // if(pages[i]*limit >= counts){
       //   active[i] = 'disabled';
       // }else {
       //   if(pages[i] == num_page){
       //     active[i] = 'active';
       //   }else{
       //     active[i] = '';
       //   }
       //
       // }

       active[i] = (pages[i] == num_page) ? 'active' : '';
     }

     limits = '' + (num_page - 1) * limit + ',' + limit + '';
     console.log("pages = ", pages);
     // limits = "0, " + limit;
   }

   try {
      let count_item = await Main.query("SELECT count(*) as items FROM catalog");
      let items = count_item[0].items;
          // if((num_page - 1) * limit >= items){
          //
          // }
          // console.log('count_item = ', items);
      let result = await Main.query("SELECT * FROM catalog LIMIT " + limits); //" WHERE id IN " + strid);
         
      let str = "";
      for(let i = 0, len = result.length; i < len; i++){
				let cut = result[i].text;
				let href = result[i].category_id - 1;
				result[i].category_id = category[href];
				if(cut.length > 200){
					result[i].text = cut.slice(0, 200);
				}
				  
      	str += template(result[i]);
      }
       res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
       res.header('Expires', '-1');
       res.header('Pragma', 'no-cache');
       res.status(200).render('index', {title: "Интернет-магазин", data: str, basket: basket, page: pages, active: active});
      // res.status(200).send('LOADING');
   }catch (err) {
      throw new Error(err);
   }
};