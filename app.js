let createError = require('http-errors');
let express = require('express');
// let fileUpload = require('express-fileupload');
let path = require('path');
let cookieParser = require('cookie-parser');
// let bodyParser = require('body-parser');
let logger = require('morgan');
// const querystring = require('querystring');
// let url = require('url');

let indexRouter = require('./routes/index');
// let usersRouter = require('./routes/users');
// let deliveryRouter = require('./routes/delivery');
// let inviteRouter = require('./routes/invite');
// let checkRouter = require('./routes/check');
// let adminRouter = require('./routes/admin');

let app = express();
app.disable('x-powered-by');


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
app.use('/users', usersRouter);
app.use('/delivery', deliveryRouter);
app.use('/invite', inviteRouter);
app.use('/', checkRouter);
app.use('/', adminRouter);

// app.use('/users/cool', coolRouter);

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
