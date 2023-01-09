const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const multer = require('multer')
const file = require('./utils/multer')



//routes setup
let adminRoute = require('./routes/adminRoute');
let userRoute = require('./routes/userRoute');

const app = express();



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



//middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//public folder setup
app.use(express.static(path.join(__dirname, 'public')));
//multer file upload
app.use(multer({ storage: file.storage }).array("image", 10));



//session setup
const oneHour = 1000*60*60;
app.use(session({
    secret: 'secretKey',
    resave: true,
    saveUninitialized: true,
    cookie: {maxAge: oneHour}
}))



//Cache Control
app.use((req,res,next)=>{
    res.set('Cache-Control','no-store');
    next();
})



//Routes setup
app.use('/', userRoute);
app.use('/admin', adminRoute);



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

// module.exports = app;
app.listen(3000)