window.onload = function () {
  console.log($('#tab2'));
  // let tab2 = document.getElementById('tab2');
  // console.log("tab2 = ", tab2);
  // $(document).ready(function () {

  $('#addblog').submit(function (event) {
    // let elem = event.target;
    event.preventDefault();
    let putbody = $('#addblog').serialize();
    let arr = putbody.split('&');
    // console.log('arr = ', arr);

    let fname = $('input[type=file]')[0].files[0];
    // console.log('fname = ', fname);
    // alert('Message');
    // alert(fname);
    let form_data = new FormData();
    form_data.append('file', fname);
    for(let i = 0; i < arr.length; i++){
      let pair = arr[i].split('=');
      form_data.append(pair[0], pair[1]);
    }
    // console.log(form_data.getAll('files'));

    $.ajax({
      type: 'PUT',
      url: "/panel/admin",
      dataType: 'text',
      data: form_data,
      processData: false,
      contentType: false,
      cache: false,
      success: function (msg) {
        console.log('message from server: ', msg);
        setTimeout("window.location = '/panel/admin'",100);
      }
    });
  });


  // let edit = document.getElementById('edit');
  let copy = document.getElementById('copy');
  let mordor = document.getElementById('mordor');

  mordor.addEventListener('click', function(ev){
    // console.log('Call edit ', ev.target);
    let elem = ev.target;
    if(elem.type != 'checkbox') return false;
    if(!elem.checked) return false;
    // ttt = elem;
    let tr = $(elem).closest('tr')[0];
    // console.log('tr= ', tr);
    let id = tr.dataset.id;
    let td = tr.children;
    let contact = document.getElementById('nav-contact');
    let editblog = document.getElementById('editblog');
    if(editblog != undefined){
      editblog.remove();
    }
    // for(let i = 0; i < td.length; i++){
    //   console.log($(td[i]).text());
    // }
    let pict = td[2].children[0].src;
    let price = td[5].innerHTML;
    let header = td[3].innerHTML; 
    let txt = td[4].innerHTML;


    let template = `
    <form id="editblog" enctype="multipart/form-data" action="/panel/admin/update" method="post">
      <div class="form-group row">
        <label for="article-add" class="col-sm-2 col-form-label">Краткое описание продукта</label>
        <div class="col-sm-8">
          <input type="text" class="form-control" id="article-add" name="header" value="${header}">
          <input type="hidden" name="id" value="${id}">
        </div>
      </div>
      <div class="form-group row">
        <label for="price" class="col-sm-2 col-form-label">Цена</label>
        <div class="col-sm-2">
          <input type="text" class="form-control" id="price" name="price" value="${price}">
        </div>
        <label for="count" class="col-sm-2 col-form-label">Количество</label>
        <div class="col-sm-2">
          <input type="text" class="form-control" id="count" name="count">
        </div>
      </div>

      <div class="form-group row">
        <div class="form-group col-sm-4">
          <label for="category-sel" class="col-form-label">Выбор продукта</label>
            <select class="form-control" id="category-sel" name="category_id">
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
        </div>
      </div>
      <div class="form-group">
        <label for="full-article">Подробное описание продукта</label>
        <textarea class="form-control" id="full-article" name="text" rows="5">${txt}</textarea>
      </div>
      <div class="form-group">
        <label for="files">выбрать файл для загрузки</label>
        <input type="file" id="files" name="sendfile" multiple />
      </div>
      <div class="form-group">
        <img src="${pict}" alt="" class="thumb"/>
        <output id="list"></output>
      </div>
      <div class="form-group row">
        <div class="col-sm-10">
          <button type="submit" class="btn btn-primary">Обновить позицию</button>
        </div>
      </div>
    </form>
    `;
    $("#nav-home-tab").removeClass("active show");
    $("#nav-home-tab").attr("aria-selected", "false");
    $("#nav-contact-tab").addClass("active show");
    $("#nav-contact-tab").attr("aria-selected", "true");
    $("#nav-home").removeClass("active show");
    $("#nav-contact").addClass("active show");
    contact.insertAdjacentHTML('afterBegin', template);

    function handleFileSelect(evt) {
      let files = evt.target.files; // FileList object
      console.log("files=", files);
      let f = files[0];
      if (!f.type.match('image.*')) return false;

      let reader = new FileReader();
      reader.onload = (function(theFile) {
        return function(e) {
          // Render thumbnail.
          let span = document.createElement('span');
          span.innerHTML = ['<img class="thumb" src="', e.target.result,
            '" title="', theFile.name, '"/>'].join('');
          document.getElementById('list').insertBefore(span, null);
        };
      })(f);
        // Read in the image file as a data URL.
        reader.readAsDataURL(f);

    }

    document.getElementById('files').addEventListener('change', handleFileSelect, false);
  });

};


  