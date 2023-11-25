const mongoose = require('mongoose');

const connectDatabase = async()=>{
    try {
        mongoose.set('strictQuery', false);
        const mongodb = await mongoose.connect(process.env.MONGO_URI);
        console.log(`mongodb connected:${mongodb.connection.host}`);
    } catch (error) {
        console.log('Database Error:',error.message);
        process.exit();
    }
};

module.exports = connectDatabase ;