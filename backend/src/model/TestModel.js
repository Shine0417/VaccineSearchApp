import mongoose from 'mongoose';

// 資料schema
const Schema = mongoose.Schema;

var TestModelSchema = new Schema({
    name: String,
    score: Number,
});
var TestModel = mongoose.model('TestModel', TestModelSchema );

export default TestModel;