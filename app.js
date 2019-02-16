let createError = require('http-errors');
let express = require('express');
// let fileUpload = require('express-fileupload');
let path = require('path');
let cookieParser = require('cookie-parser');
// let bodyParser = require('body-parser');
let logger = require('morgan');
let mysql = require('mysql');
// let url = require('url');

let indexRouter = require('./routes/index');
// let usersRouter = require('./routes/users');
// let deliveryRouter = require('./routes/delivery');
// let inviteRouter = require('./routes/invite');
// let checkRouter = require('./routes/check');
// let adminRouter = require('./routes/admin');

let app = express();
app.disable('x-powered-by');



// console.log("HOST:", process.env.OPENSHIFT_MYSQL_DB_HOST);
// console.log("ENV:", process.env);
// console.log('MYSQL_USER:', process.env.MYSQL_USER);
// console.log('BD NAME:', process.env.DATABASE_SERVICE_NAME);
// console.log('BD NAME:', process.env.database_name);
// console.log('MYSQL_PASSWORD:', process.env.MYSQL_PASSWORD);
// console.log('MYSQL_DATABASE:', process.env.MYSQL_DATABASE);
// console.log('MYSQL_ROOT_PASSWORD:', process.env.MYSQL_ROOT_PASSWORD);
console.log('MYSQL_SERVICE_HOST:', process.env.MYSQL_SERVICE_HOST);
// console.log('MYSQL_SERVICE_PORT:', process.env.MYSQL_SERVICE_PORT);

var connection = mysql.createConnection({
  host     : process.env.MYSQL_SERVICE_HOST,
  port     : '3306',
  user     : 'user',
  password : '123',
  database : 'food'
 });

 connection.connect( function(err){
if (err){ 
    throw err;
}
else {
    console.log('Connected');
}
 });

// MYSQL_SERVICE_HOST: '172.30.146.69
// MYSQL_PORT: 'tcp://172.30.146.69:3306'
// MYSQL_SERVICE_PORT: '3306'
// FOODS_PORT: 'tcp://172.30.138.215:8080'
// MYSQL_PORT_3306_TCP_ADDR: '172.30.146.69'
// FOODS_SERVICE_HOST: '172.30.138.215'

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.use(logger('dev'));
// app.use(url);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(express.bodyParser({ keepExtensions: true, uploadDir: "uploads" }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/delivery', deliveryRouter);
// app.use('/invite', inviteRouter);
// app.use('/', checkRouter);
// app.use('/', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
