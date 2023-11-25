const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const flash = require('connect-flash');
const userRouter = require('./routes/userRoute');
const adminRouter = require('./routes/adminRoute');
const connectDatabase = require('./config/database')
require('dotenv').config()
const app = express();
//database connection
connectDatabase()

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(flash());

//public folder setup
app.use(express.static(path.join(__dirname, 'public')));

//session setup
const oneHour = 1000*60*60;
app.use(session({
    secret: process.env.SESSION_KEY,
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
app.use('/', userRouter);
app.use('/admin', adminRouter);


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

// creating local server
app.listen(process.env.PORT,(error)=>{
  if(error){
    console.log("Server Error:",error.message);
  }else{
    console.log("Server running on",process.env.DOMAIN);
  }
})