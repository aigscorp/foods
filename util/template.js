function templater(strings, ...keys) {
   return function(data) {
       let temp = strings.slice();
       keys.forEach((key, i) => {
           temp[i] = temp[i] + data[key];
       });
       return temp.join('');
   }
};

const template = templater`<div class="col-md-4 blog">
  <div class="block-news" id="anime${'id'}">
    <div class="block-single">
      <div class="block-news-img">
        <div class="image">
          <a href="/${'category_id'}/detail/${'id'}">
            <img src="/img/${'path'}" alt="${'header'}" data-find=${'id'} data-price=${'price'}>
          </a>
        </div>
      </div>
      <div class="block-news-content">
        <a href="/${'category_id'}/detail/${'id'}">
          <h3>${'header'}</h3>
        </a>
        <p>${'text'}
        </p>
        <div class="pricer">${'price'} руб.</div>
        
      </div>
      
    </div>
    <a href="" class="btn btn-primary busket" style="width:90%;margin-top:-15px;" data-search=${'id'}>В корзину</a>
  </div>
 </div>
`;

module.exports = template;




