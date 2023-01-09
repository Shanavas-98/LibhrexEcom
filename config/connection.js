const mongoose = require('mongoose');

mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/LibhrexEcom")
.then(()=>{
    console.log("db connection successful");
})
.catch((error)=>{
    console.log(error);
})