const {Schema, model} = require('mongoose');
const tokenService = require('../services/token.service');

const UserSchema = new Schema({
    name: {type: String, trim: true, required: true},
    age: {type: Number, default: 18},
    password: {type: String, required: true},
    avatar: {type: String, default: ''},
    phone: { type: String, required: true },
    email: {type: String, trim: true, lowercase: true, required: true}
}, {timestamps: true});


UserSchema.statics = { // for schema // THIS - SCHEMA
    testStatic() {
        console.log('THIS IS STATIC ______________________-');
        console.log(this);
        console.log('THIS IS STATIC ______________________-');
    },

     async createUserWithHashPassword(userObject = {}){
        const hashPassword = await tokenService.hashPassword(userObject.password);

        return  this.create({...userObject, password: hashPassword});
    }


};
UserSchema.methods = { // for single record // THIS - RECORD
    testMethod() {
        console.log('THIS IS METHOD ______________________-');
        console.log(this);
        console.log('THIS IS METHOD ______________________-');
    },

    async checkIsPasswordSame(password){
        await tokenService.comparePasswords(password, this.password);
    }
}


module.exports = model('user', UserSchema);
