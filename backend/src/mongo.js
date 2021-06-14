import mongoose from 'mongoose';

var mongoDB = 'mongodb://34.80.120.222/test?'; // DB路徑

function connectMongo() { //不用管
    mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
    // Get Mongoose to use the global promise library
    mongoose.Promise = global.Promise;
    //Get the default connection
    const db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function () {
        console.log('Mongo database connected!');
    });
}

const mongo = {
    connect: connectMongo,
};

export default mongo; // 把連線回傳給server.js