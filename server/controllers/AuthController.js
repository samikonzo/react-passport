const mongoose = require('mongoose')
const passport = require('passport')
const User = require('../models/user.js')
const l = console.log

const UserController = {}

UserController.showUsers = () => {
	l(User.find())
}

UserController.doRegister = (req, res, next) => {

	UserController.showUsers()

	User.register(new User({
		username : req.body.username,
		mail : req.body.mail,
	}), req.body.password, (err, user) => {
		if(err){
			return res.redirect('/register')
		}
	})

	passport.authenticate('local')(req, res, () => {
		res.redirect('/')
	})
}
UserController.doLogin = (req, res, next) => {

	UserController.showUsers()

	passport.authenticate('local')(req, res, function(err, user){
		if(err){
			res.send('login error')
		} else {
			res.send('login success')
		}
	})
}
UserController.logout = (req, res, next) => {

	UserController.showUsers()

	req.logout()
	res.redirect('/')
}
UserController.isLogged = (req, res, next) => {

	UserController.showUsers()

	res.send(req.isAuthenticated())
}





























module.exports = UserController
