let createError = require('http-errors');
let express = require('express');
let compress = require('compression');
let path = require('path');
let cookieParser = require('cookie-parser');
// let bodyParser = require('body-parser');
let logger = require('morgan');
let fs = require('fs');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/users');
// let coolRouter = require('./routes/cool');
let deliveryRouter = require('./routes/delivery');
let inviteRouter = require('./routes/invite');
let caucasusRouter = require('./routes/caucasus');
let checkRouter = require('./routes/check');
let adminRouter = require('./routes/admin');

let app = express();
app.disable('x-powered-by');

app.use('/', function(req, res, next){
  let path = req.path.trim();
  if(path.search('11.jpg') != -1){
    console.log('PATH = ', path);
    fs.createReadStream('./public/img/11.jpg').pipe(res);
  }else{
    next();
  }
  
});
app.use(compress());
app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/delivery', deliveryRouter);
app.use('/invite', inviteRouter);
app.use('/caucasus', caucasusRouter);
app.use('/', checkRouter);
app.use('/', adminRouter);

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
