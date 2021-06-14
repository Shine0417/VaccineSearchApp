import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
// 資料schema
const Schema = mongoose.Schema;

var HospitalModelSchema = new Schema({
    name: String,
    password: String,
    publicKey: String,
});


HospitalModelSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  };
HospitalModelSchema.methods.validPassword = function(password) {
return bcrypt.compareSync(password, this.password);
};

var HospitalModel = mongoose.model('HospitalModel', HospitalModelSchema);

export default HospitalModel;