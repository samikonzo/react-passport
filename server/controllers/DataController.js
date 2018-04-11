const mongoose = require('mongoose')
const passport = require('passport') // really needed here?
const User = require('../models/user.js')
const l = console.log

const DataController = {}

DataController.isUserAuthed = (req,res,next) => {
	if(req.isAuthenticated()) next()
	else res.redirect('/')	
}

DataController.getUserInfo = (req, res, next) => {
	l('DataCotroller')

	setTimeout(() => {
		if(req.user){
			res.send({user : req.user})
		} else {
			res.status(401).send()		
		}
	}, 3000)


}






module.exports = DataController