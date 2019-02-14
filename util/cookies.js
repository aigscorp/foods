function CreateBack (id, num, img, name, price, count = 1) {
  this.id = id;
  this.num = num;
  this.img = img;
  this.name = name;
  this.price = price;
  this.count = count;
  return this;
};

exports.checkcook = function(results, res_count, arr){
  let back = [];
  let num = 1;
  for(let i = 0, len = arr.length; i < len; i++){
    let tmp = +arr[i].substr(3, arr[i].indexOf(',')-3);
    let cnt = +arr[i].substr(arr[i].indexOf('count:') + 'count:'.length);
    for(let j = 0; j < res_count; j++){
      if(tmp == results[j].id){
        if(back.length != 0){
          let found = false;
          for(let i = 0; i < back.length; i++) {
            if (back[i].id == tmp) {
              found = true;
            }
          }
          if(found == false){
            num++;
            back.push(new CreateBack(results[j].id, num, 'img/' + results[j].path, results[j].header, results[j].price, cnt));
          }
        }else {
          back.push(new CreateBack(results[j].id, num, 'img/' + results[j].path, results[j].header, results[j].price, cnt));
        }
      }
    }
  }
  return back;
};

exports.checkcookie = function(results, res_count, str){
  let uid = parseCookieVal(str, "|", ",");
  let num = 1;
  let back = [];

  // console.log('-------------------------------------');
  // console.log('uid = ', uid);
  // console.log('-------------------------------------');

  for(let i = 0, len = uid.length; i < len; i++){
    for(let j = 0; j < res_count; j++){
      if(uid[i].id == results[j].id){
        // if(uid[i].hasOwnProperty('del')){
        //   break;
        // }else{
        if(back.length == 0){
          back.push(new CreateBack(results[j].id, num, 'img/' + results[j].path, 
                    results[j].header, results[j].price, uid[i].count));
        }else{
          let found = false;
          for(let k = 0; k < back.length; k++){
            if(back[k].id == uid[i].id){
              found = true;
              back[k].count = uid[i].count;
              break;
            }
          }
          if(found == false){
            num++;
            back.push(new CreateBack(results[j].id, num, 'img/' + results[j].path, 
                      results[j].header, results[j].price, uid[i].count));
          }
        }
        // }
      }
    }
  }

  // console.log('___________________________________________');
  // console.log('back = ', back);
  // console.log('___________________________________________');
  return back;
};

function parseCookieVal(str, delim1, delim2){
	let obj = null;
	let res = [];
	let arr_val = str.split(delim1);
	for(let i = 0, len = arr_val.length; i < len; i++){
		let tmp = arr_val[i].split(delim2);
		obj = new Object();
		for(let j = 0, len_tmp = tmp.length; j < len_tmp; j++){
			let pair = tmp[j].split(':');
			obj[pair[0]] = +pair[1]; //преобразовать строку в число
		}
		res.push(obj);
	}
	return res;
};
exports.parsing = function(str, delim1, delim2){
  return parseCookieVal(str, delim1, delim2);
};
