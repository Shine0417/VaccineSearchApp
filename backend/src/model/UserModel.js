import mongoose from 'mongoose';
// 資料schema
const Schema = mongoose.Schema;

var UserModelSchema = new Schema({
    name: String,
    ID: { type: String, required: true, index: { unique: true} },
    Injection: [{
        vaccineName: String,
        date: Date,
        duration: Number,
        count: Number,
        hospitalName: String,
        doctorName: String,
    }],
});
var UserModel = mongoose.model('UserModel', UserModelSchema);

export default UserModel;