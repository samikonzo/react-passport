const mongoose = require('mongoose')
const passport = require('passport')
const User = require('../models/user.js')
const l = console.log

const UserController = {}

UserController.showUsers = () => {
	User.find()
		.then((data) => {
			l(data)
		})
}

UserController.doRegister = (req, res, next) => {

	//l(req.body)
	UserController.showUsers()

	User.register(new User({
		username : req.body.username,
	}), req.body.password, (err, user) => {
		if(err){
			l('doRegister error', err)
			res.status(400)
			return res.send(err)
		}

		//return res.redirect('/')
		passport.authenticate('local')(req, res, () => {
			res.redirect('/')
		})
	})
}

UserController.registerCheckUsernameAvailable = (req, res) => {
	// check user exist

	var username = req.body.username
	User.findOne({username : username}, (err, user) => {
		if(user){
			l('user exist, send 400')
			res.status(400).send('User with that username already exist')
		} else {
			res.send('no users with this username')
		} 
	} )
}

UserController.doLogin = (req, res, next) => {

	//UserController.showUsers()

	passport.authenticate('local')(req, res, function(err, user){
		if(err){
			res.send(err)
		} else {
			res.send('login success')
		}
	})
}

UserController.logout = (req, res, next) => {

	//UserController.showUsers()
	//l(req.isAuthenticated())
	//l(req.logout)
	//l(req.isAuthenticated())

	req.logout()
	res.redirect('/')
}

UserController.authStatus = (req, res, next) => {

	//UserController.showUsers()
	l('authStatus : ', req.isAuthenticated())
	res.send(req.isAuthenticated())
}


module.exports = UserController
