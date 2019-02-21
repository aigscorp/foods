let Admin = require('../models/pool');
const fs = require('fs');
// let multer = require('multer');
// let twig = require('twig');
// let storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, './public/img/shop/delivery/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.originalname);
//   }
// });
//
// let upload = multer({storage: storage}).single('file');
// let upload2 = multer({storage: storage}).single('sendfile');

let categories = ['delivery', 'invite', 'caucasus'];

exports.main = async function (req, res) {
  try {
    let results = await Admin.query("SELECT * FROM catalog");
    // console.log('results: ', results);
    res.status(200).render('admin', {result: results});
  }catch (e) {
    throw new Error(e);
  }
};

exports.add = async function (req, res) {

  // console.log("file = ", req.files);
  try {
      let data = getParams(req);
      console.log("data = ", data);
      let chunck, filename, pathfile = "";

      if(req.files.file != undefined){
        chunck = req.files.file.data;
        filename = req.files.file.name;
        let writeStream = fs.createWriteStream('./public/img/shop/' + categories[data[0] - 1] + '/' + filename);
        writeStream.write(chunck);
        writeStream.end();
        writeStream.on('error', function (err) {
          throw new Error(err);
        });
        pathfile = "/shop/" + categories[data[0] - 1] + "/" + filename;
      }
      data.push(pathfile);
      await Admin.query("INSERT INTO foods.catalog(category_id, header, text, price, path) VALUES(?,?,?,?,?)", data);
      // Admin.query("INSERT INTO foods.catalog(category_id, header, text, price) VALUES(?,?,?,?)", add);
      console.log('data = ', data);

      res.status(200).send('Продукт добавлен');
      // res.redirect(303, '/panel/admin');
  }catch(err){
    throw new Error(err);
  }
};

exports.search = async function (req, res) {
  console.log("search method = ", req.method);
  let search = (req.body.search).trim() + '%';
  console.log('search = ', search);
  try {
    let results = await Admin.query("SELECT * FROM catalog WHERE text like ?", search);
    res.status(200).render('admin', {result: results});
  }catch (e) {
    throw new Error(e);
  }
  // res.status(200).send('Update article in DB');
};

exports.update = async function(req, res){

  console.log("body busboy: ", req.body);
  console.log('files:', req.files);
  try{
    let data = getParams(req);
    let id = +req.body.id;
    // console.log("data = ", data);
    let stateFile = req.files.sendfile;
    let chunck, filename, pathfile = "", delFile = "";

    if(stateFile != undefined){
      chunck = stateFile.data;
      filename = stateFile.name;
      let writeStream = fs.createWriteStream('./public/img/shop/' + categories[data[0] - 1] + '/' + filename);
      writeStream.write(chunck);
      writeStream.end();
      writeStream.on('error', function (err) {
        throw new Error(err);
      });
      pathfile = "shop/" + categories[data[0] - 1] + "/" + filename;
     }

    delFile = await Admin.query("SELECT path FROM catalog WHERE id = ?", id);
    console.log("delfile = ", delFile[0]);
    if(pathfile == ""){
      pathfile = delFile[0].path;
      console.log('pathfile = ', pathfile);
    }
    data.push(pathfile, id);
    console.log("data = ", data);
    await Admin.query("UPDATE catalog SET category_id = ?, header = ?, text = ?, price = ?, path = ? WHERE id = ?", data);
    if(stateFile != undefined && delFile[0].path != ""){
      let eraseFile = './public/img/' + delFile[0].path;
      fs.unlink(eraseFile, function (err) {
        if(err) return console.log("Error delete file");
        console.log('file deleted successfully');
      });
    }

    res.redirect(303, '/panel/admin');
  }catch (err) {
    throw new Error(err);
  }
};

function getParams(req) {
  let header = decodeURI(req.body.header);
  let text = decodeURI(req.body.text);
  let price = req.body.price;
  let category_id = +req.body.category_id;
  let res = [category_id, header, text, price];
  return res;
};

// let fname = req.files.file.name;
// let data = req.files.file.data;
// let fullpath = "./public/img/"+fname;

// fs.writeFile(fullpath, data, function(error){
//
//   if(error) throw error; // если возникла ошибка
//   console.log("Асинхронная запись файла завершена. Содержимое файла:");
//   let data = fs.readFileSync(fullpath);
//   // console.log(data);  // выводим считанные данные
// });

// req.on('data', function (data) {
//   console.log("call = ", data);
// });


// let loadfile = req.files.file;
// let uploadPath = __dirname + '/uploads/' + loadfile;
//
// loadfile.mv(uploadPath, function(err) {
//   if (err) {
//     return res.status(500).send(err);
//   }
//
//   res.send('File uploaded to ' + uploadPath);
// });
