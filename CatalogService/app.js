
var cors = require('cors')
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var createArticle = require('./routes/createArticle');
var getArticle = require('./routes/getArticle');
var deleteArticle = require('./routes/deleteArticle');
var getAll = require('./routes/getAll');
var changeArticle = require('./routes/changeArticle');
var createPicture = require('./routes/createPicture');
var deletePicture = require('./routes/deletePicture');
var getPicture = require('./routes/getPicture');

var app = express();
app.use(cors())

app.use(express.json({limit: '50mb'}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/createArticle', createArticle);
app.use('/getArticle', getArticle);
app.use('/deleteArticle', deleteArticle);
app.use('/getAll', getAll);
app.use('/changeArticle', changeArticle);
app.use('/createPicture', createPicture);
app.use('/deletePicture', deletePicture);
app.use('/getPicture', getPicture);


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