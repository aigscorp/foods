(function(){

  window.onload = function(){
    let row_id = document.getElementById('row-id');
    // console.log('row_id=', row_id);
    row_id.addEventListener('click', (ev) => {
      let elem = ev.target;
      // console.log(elem);
      if(!$(elem).hasClass("btn")) return false;

      ev.preventDefault();
      let search = $(elem).data('search');
      let attr = document.getElementById('row-id').querySelectorAll("[data-find='" + search + "']", "[data-price]")[0];
      
      let price = +attr.dataset.price;
      let price_data = price;
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
      // let uid = get_cookie('uid');
      let doc_cookie = decodeURIComponent(document.cookie);

      console.log('doc_cookie: ', doc_cookie);

      let find_uid = getCookieVal('uid', doc_cookie);
      // console.log('find_uid: ', find_uid);
      // uid = createId(uid, search);
      let uid = createCookieVal(find_uid, search);
      // console.log('after uid: ', uid);

      /*****************************************************/
      // added for test databox
      /*****************************************************/
      let data = DataBox();
      let search_data = +search;
      let count_data = count;
      price_data = +price_data;
      let state = data.setData('uid', {id: search_data, count: 1, price: price_data}, 'id');
      if(state == false){
        count_data = data.getData('uid', {id: search_data, count: 1});
        data.changeData('uid', {id: search_data, count: count_data + 1});
      }
      // console.log("data = ", data);

      animeBlog(search);
      set_cookie('count', count);
      set_cookie('price', price);
      set_cookie('uid', uid);


      //, 2020, 01, 01, "/localhost:3000"
    }, true);

    (function(){
      let pagination = document.getElementsByClassName('pagination')[0];
      if(pagination == undefined) return;
      pagination.addEventListener('click', (ev) => {
      
      let elem = ev.target;
      // if(!$(elem).hasClass('page-link') || !$(elem).attr('aria-hidden')) return false;
      if(!$(elem).hasClass('page-link')){
        if($(elem).attr('aria-hidden') == "false"){
          return false;
        }else{
          elem = $(elem).closest('.page-link')[0];
        }
      }
      
      let pressElem = elem.dataset.pid;
      let pageitemactive = $(elem).closest('.page-item')[0];
      
      let pageitem = $(pagination).children('.page-item');
      let pagelink = $(pageitem).children('.page-link');

      let active_item;
      for(let i = 0; i < pageitem.length; i++){
        if($(pageitem[i]).hasClass('active') == true){
          let tmp = $(pageitem[i]).children()[0];
          active_item = tmp.dataset.pid;
        }
        $(pageitem[i]).removeClass('active');
      }

      // let current_item = $(pageitemactive).children()[0].dataset.pid;
      // $(pageitemactive).addClass('active');

      // console.log('current active', active_item);
      // console.log("current = ", current_item);
      let arr = [];
      for(let i = 0; i < pagelink.length; i++){
        arr.push(pagelink[i].dataset.pid);
      }
      // console.log(arr.join(','));
      let pag = arr.join(',') + '|' + pressElem + "," + active_item;
      set_cookie('pag', pag);
    }, true);
    })();
    

    $(document).scroll(function(){
      let elem = $('.header-menu');
      // console.log($(this).scrollTop() - $(elem).height() );
      if($(this).scrollTop() > $(elem).height() + 5){
        $(elem).addClass('fixed-menu');
      }else{
        $(elem).removeClass('fixed-menu');
      }
    });
    $('.goto').click(function(){
      let scroll_elem = $(this).attr('href');
      // window.location = '/';
      if($(scroll_elem).length != 0){
        $('html, body').animate({scrollTop: $(scroll_elem).offset().top}, 1000);
      }
      return false;
    });
  };

  function animeBlog(search){
    let blog = document.getElementById('anime'+search);
    let htmltxt = blog.innerHTML;
    // console.log('txt = ', htmltxt);
    let rect = blog.getClientRects();
    // console.log('rest = ', rect[0].x, rect[0].y, rect[0].width, rect[0].height);
    let fly = document.createElement('div');
    fly.insertAdjacentHTML("afterBegin", htmltxt);
    fly.style.top     = (rect[0].top + pageYOffset) + 'px';
    fly.style.width   = rect[0].width + 'px';
    fly.style.left    = (rect[0].left + pageXOffset) + 'px';
    fly.style.height  = rect[0].height + 'px';

    fly.style.background = '#aeaeae';
    fly.style.position = 'absolute';
    // $(fly).addClass("animate");
    // fly.style.overflow = 'hidden';
    let root = document.documentElement;
    root.appendChild(fly);

    $(fly).animate({
      borderSpacing: 1,
      opacity: 'toggle',
      top: 0,
      left: window.innerWidth - rect[0].width - rect[0].top + 'px',
    }, {
          step: function(now,fx) {
              $(this).css('transform','rotate('+now+'deg)');
              // $(this).css('width', rect[0].width - 0.1*now + 'px');
              // $(this).css('height', rect[0].height - 0.1*now + 'px');
          },

          duration: 500,
          specialEasing: {
              opacity: 'linear',
              height: 'swing'
          }
      },'linear');

  };

  function set_cookie (name, value, exp_y, exp_m, exp_d, path, domain, secure){
    let cookie_string = name + "=" + encodeURIComponent(value);
    cookie_string += "; path='/'";
    if(exp_y){
      let expires = new Date ( exp_y, exp_m, exp_d );
      cookie_string += "; expires=" + expires.toGMTString();
    }
    if(path)
      cookie_string += "; path=" + encodeURIComponent(path);
    if(domain)
      cookie_string += "; domain=" + encodeURIComponent(domain);
    if(secure)
      cookie_string += "; secure";
    
    document.cookie = cookie_string;
  };

  function get_cookie(name) {
    let all = decodeURIComponent(document.cookie).split(';');
    // console.log('all cookies:', all);
    let lens = name.length;
    for(let i = 0, len = all.length; i < len; i++){
        let tmp = all[i].trim();
        if(tmp.substr(0, lens) == name){
            return tmp.substr(lens + 1);
        }
    }
    return '';
  };


  function del_cookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };

  function createId(str, id){
    let tmp = "";
    if(str == ''){
      tmp = 'id:'+id+',count:1';
    }else{
      tmp = str;
      let arr = str.split('|');
      // arr.pop();
      let found = false;
      for(let i = 0; i < arr.length; i++){
        let brr = arr[i].split(',');
        let cid = +brr[0].substr(3);
        let count = +brr[1].substr(6);
        if(cid == id){
          brr[1] = 'count:' + ++count;
          arr[i] = brr[0] + ',' + brr[1];
          found = true;
          break;
        }
      }
      if(found == false){
        tmp += '|id:'+id+',count:1';
      }else{
        tmp = arr.join('|');
        // tmp += '|';
      }
    }
    return tmp;
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



})();