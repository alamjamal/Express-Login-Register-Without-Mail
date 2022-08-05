const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userType: {type: String, enum : ['teacher','principle','admin'],default: 'teacher', required: true},
    organisation: { type: String, required: true, trim:true},
    firstName: { type: String, required: true, trim:true },
    lastName: { type: String, trim:true},
    email: { type: String, required: true, unique: true, trim:true },
    password: { type: String, required: true },
    mobile: { type: String, required: true , trim:true},
    pinCode: { type: Number, required: true , trim:true},
    address: { type: String, trim:true},
    
},{timestamps: true});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.password;
    }
});

module.exports = mongoose.model('User', schema);
