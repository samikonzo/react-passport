var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose')

var UserSchema = new Schema({
	username: String,
	password: String,
	avatar : {
		type: String,
		default: undefined,
	},
	
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)