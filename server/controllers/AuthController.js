const mongoose = require('mongoose')
const passport = require('passport')
const User = require('../models/user.js')
const l = console.log


var serverResponseLongTime = false 





const UserController = {}

UserController.showUsers = () => {
	User.find()
		.then((data) => {
			l(data)
		})
}

UserController.doRegister = (req, res, next) => {

	//l(req.body)
	//UserController.showUsers()

	User.find().then( users => {
		var count = users.length

		User.register(new User({
			username : req.body.username,
			id : count,
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
	})

}

UserController.registerCheckUsernameAvailable = (req, res) => {
	// check user exist

	setTimeout(() => {
		var username = req.body.username
		User.findOne({username : username}, (err, user) => {
			if(user){
				l('user exist, send 400')
				res.status(400).send('User with that username already exist')
			} else {
				res.send('no users with this username')
			} 
		} )
	}, serverResponseLongTime ? 3000 : 0 )
}

UserController.doLogin = (req, res, next) => {

	//UserController.showUsers()
	//l(req.body)
	setTimeout(() => {
		var username = req.body.username
		User.findOne({username: username}, (err, user) => {
			if(user) l('user exist', user)
			else res.status(401).send('no user with username : ' + username)
		})

		passport.authenticate('local')(req, res, function(err, user){
			if(err){
				//res.status(401).send('password is wrong')
			} else {
				l(req.user)
				res.send(req.user)
			}
		})
		
	}, serverResponseLongTime ? 3000 : 0 )
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
	setTimeout(() => {
		l('authStatus : ', req.isAuthenticated())
		var authStatus = req.isAuthenticated()
		if(authStatus){
			res.send(req.user)
		} else {
			res.send(authStatus)
		}
	}, serverResponseLongTime ? 4000 : 0 )
}


module.exports = UserController
