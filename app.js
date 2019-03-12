var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var homeRouter = require('./routes/home');
var userRouter = require('./routes/user');
var saveRouter =  require('./routes/save');
var cartRouter = require('./routes/shoppingcart')
var orderRouter = require('./routes/order')
var detailRouter = require('./routes/detail')
var classifyRouter = require('./routes/classify')
var searchRouter = require('./routes/search')
var addressRouter = require('./routes/address')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
      res.sendStatus(200); /让options请求快速返回/
  }
  else {
      next();
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/home',homeRouter)
app.use('/user',userRouter)
app.use('/save',saveRouter)
app.use('/shoppingcart',cartRouter)
app.use('/order',orderRouter)
app.use('/detail',detailRouter)
app.use('/classify',classifyRouter)
app.use('/search',searchRouter)
app.use('/address',addressRouter)

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
