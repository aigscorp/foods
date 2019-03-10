function Datastore(id, count, price){
  this.id = id;
  this.count = count;
  this.price = price;
};

function Storage(){
  this.store = [];
};

Storage.prototype.add = function(store){
  let index = this.isId(store);
  if(index >= 0){
    this.store[index].count += store.count;
    this.store[index].price += store.price;
    return; 
  }
  this.store.push(store);
};
Storage.prototype.delete = function(store){
  let index = this.isId(store);
  if(index >= 0){
    this.store.splice(index, 1);
  }
};
Storage.prototype.isId = function(store){
  let id = 0;
  if(store instanceof Datastore){
    id = store.id;
  }else {
    return console.log('Not object value passed');
  }
  for(let i = 0, len = this.store.length; i < len; i++){
    if(this.store[i].id == id) return i;
  }
  return -1;
};
Storage.prototype.toString = function(){
  let value = this.store;
  let all = this.store.length;
  let total = 0;
  let str = "";
  for(let key in value){
    let tmp = value[key];
    total++;
    let len = Object.keys(tmp).length;
    let count = 1;
    for(let key in tmp){
      if(count == len){
        str += (all == total) ? key + ":" + tmp[key] : key + ":" + tmp[key] + "|";
      }else{
        str += key + ":" + tmp[key] + ";";
      }
      count++;
    }
  }
  return str;
};

store = new Storage();

(function(){
  let btn = document.getElementById('add-busket');
  
  function handler(ev){
    elem = ev.target;
    if(elem.id != 'add-busket') return;
    // console.log('THIS handler:', this);
    // btn.removeEventListener('click', handler);
    let search = +elem.dataset.id;
    let price = +document.querySelectorAll('.pricer')[0].dataset.price;
    let count = 0;
    let basket = document.getElementsByClassName('new-korzina')[0];
    let txt = basket.innerHTML;

    if(txt && txt.trim().length){
      let arr = txt.split('/', 2);
      count = +arr[0] + 1;
      price = +(arr[1].replace('руб.', '').trim()) + price;
    }else{
      count = 1;
    }
    txt = ' ' + count + ' / ' + price + ' руб.';
    basket.innerHTML = txt;

    let doc_cookie = decodeURIComponent(document.cookie);
    // console.log('doc_cookie: ', doc_cookie);
    let find_uid = getCookieVal('uid', doc_cookie);
    // console.log('find_uid: ', find_uid);
    // uid = createId(uid, search);
    let uid = createCookieVal(find_uid, search);
    // console.log('after uid: ', uid);
    
    let xhr = new XMLHttpRequest();
    xhr.open('post', '/delivery/detail/1', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
    let json = JSON.stringify({count: ''+count, price: ''+price, uid: uid});
    
    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4 && xhr.status == 200){
        console.log('success');

        let busket = document.getElementsByClassName('right-top-header')[0];
        let tmpl = `
        <div style="position: relative;" id="wrapsale">
          <img style="height: 60px; width: 60px; transform-origin: 100% 0;
          transform: scale(0,0); position: absolute; left: 0px; top: 0px; z-index: 9998" src="/img/sale3.png" id="sale">  
        </div>
        `;
        let saleId = document.getElementById('wrapsale');
        if(saleId != undefined){
          console.log('sale id=', saleId);
          saleId.remove();
        }
        busket.insertAdjacentHTML("beforeend", tmpl);
        saleAnimate();
        
      }else if(xhr.status == 3){
        console.log('status', xhr.status);
      }else if(xhr.status == 2){
        console.log(' status = ', xhr.status);
      }
    };
    xhr.send(json);
    console.log(decodeURIComponent(document.cookie));
  };
  btn.addEventListener('click', handler);
})();

function saleAnimate(){
  console.log('this is sale');
  function counter(){
    let count = 0;
    return function(){
      return ++count;
    }
  };
  let img = document.getElementById('sale');
  
  function animate(f, delay, option, opt){
    // console.log('option=', option);
    let empty = Object.keys(option).length;
    if(empty != 0){
      img.style.transform = option.transform;
      img.style.transformOrigin = option.transformOrigin;	
    }
  
    function update_now(){
      let time = performance.now();
      let deltaTime = time - prevTime;
      prevTime = time;
      dropped += deltaTime;
      let gen; 
      if(dropped > delay){
        gen = seq();
        // console.log('dropped = ', dropped, " THE END", ' ID=', id, ' DELAY=',delay, gen);
        dropped = 0;
        animate(drawMove, 400, {transform: 'rotate(0deg)', transformOrigin: '50% 50%'}, {starting: 120, angle: 360});
        if(gen == 2){
          cancelAnimationFrame(canselSaleId);
          animate(drawScale, 300, {transform: 'scale(1.0,1.0)', transformOrigin: '50% 50%'}, {scale: 0.6, direct: 1});
        }
        if(gen == 3){
          cancelAnimationFrame(canselSaleId);
          animate(drawScale, 200, {transform: 'scale(1.6,1.6)', transformOrigin: '50% 50%'}, {scale: 0.6, direct: -1});
        }
        if(gen == 4){
          cancelAnimationFrame(canselSaleId);
          animate(drawThrotlle, 100, {transform: 'scale(1.0,1.0)', transformOrigin: '0px 0px'});
        }
        if(gen == 5) {
          cancelAnimationFrame(canselSaleId);
          animate(drawScale, 400, {transform: 'scale(1,1)', transformOrigin: '0px 0px'}, {scale: 1, direct: -1});
        }
        if(gen == 6){
          cancelAnimationFrame(canselSaleId);
          img.style.transform = 'scale(0,0)';
          img.style.transformOrigin = "";
          
          // elem.addEventListener('click', handler);
          return;
        }
        return true;
      }else{
        f(img, delay, deltaTime, opt);
      }
      canselSaleId = requestAnimationFrame(update_now);
    };
    update_now();
  };
  
  function drawThrotlle(delay){
    if(dropped > delay) return true;
    return false;
  };
  
  function drawScale(pict, delay, ticks, opt){
    let tx = (pict.style.transform).replace('scale(','').replace(')','');
    let arr = tx.split(',');
    arr[0] = +arr[0];
    arr[1] = +arr[1];
    let frame = delay / ticks;
    let step = opt.scale/frame;
    arr[0] += step * opt.direct;
    arr[1] += step * opt.direct;
    pict.style.transform = 'scale(' + arr[0] + ',' + arr[1] + ')';
  };
  
  function drawMove(pict, delay, ticks, opt){
    let l = parseInt(pict.style.left);
    let r = parseInt((pict.style.transform).replace('rotate(','').replace('deg)',''));
    let frame = delay/ticks;
    let step = opt.starting/frame;
    let cycle = opt.angle/frame;
    l += step;
    r += cycle;
    pict.style.left = l + 'px';
    pict.style.transform = 'rotate(' + r + 'deg)';
  };
  
  let prevTime = performance.now();
  let dropped = 0;
  let seq = counter();
  animate(drawScale, 500, {transform: 'scale(0,0)', transformOrigin: '100% 0'}, {scale: 1, direct: 1});

};


function createCookieVal(str, val){
  let tmp = "";
  if(str == ""){
    tmp = "id:" + val + ",count:1";
  }else{
    // tmp = getCookieVal(name, str);
    // console.log('tmp = ', tmp);
    let delim1 = '|', delim2 = ',';
    let parse = parseCookieVal(str, delim1, delim2);
    // console.log('parse = ', parse);
    let found = false;
    for(let i = 0; i < parse.length; i++){
      if(parse[i].id == +val){
        parse[i].count++;
        found = true;
        break;
      }
    }

    if(found == false){
      let obj = new Object();
      obj.id = val;
      obj.count = 1;
      parse.push(obj);
    }

    let res = [];

    for(let key in parse){
      let d = [];
      for(let index in parse[key]){
        let c = [];
        c.push(index, parse[key][index]);
        d.push(c.join(':'));
      }
      res.push(d.join(delim2));
    }
    tmp = res.join(delim1);
  }
  
  return tmp;
};

function getCookieVal(name, str){
  let arr_cookie = str.split(';');
  // console.log('arr_cookie: ', arr_cookie);
  for(let i = 0, len = arr_cookie.length; i < len; i++){
    let tmp = arr_cookie[i].split('=');
    if(tmp[0].trim() == name){
      // console.log('tmp[0]=',tmp[0],'tmp[1]=',tmp[1]);
      return tmp[1];
    }
  }
  return '';
};

function parseCookieVal(str, delim1, delim2){
  let obj = null;
  let res = [];
  let arr_val = str.split(delim1);
  // console.log('arr_val = ', arr_val);
  for(let i = 0, len = arr_val.length; i < len; i++){
    let tmp = arr_val[i].split(delim2);
    obj = new Object();
    for(let j = 0, len_tmp = tmp.length; j < len_tmp; j++){
      let pair = tmp[j].split(':');
      obj[pair[0]] = +pair[1];
    }
    res.push(obj);
  }
  return res;
};
