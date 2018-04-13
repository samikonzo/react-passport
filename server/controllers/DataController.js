const l = console.log

// database driver, api, schema
const mongoose = require('mongoose')
const User = require('../models/user.js')
const dbApi = require('../utils/databaseUtils.js')

// file uploading packets and options
const fs = require('fs')
const multer = require('multer')
const Storage = multer.diskStorage({
	destination: (req, file, cb) => {
		var path = './uploads/'
		var userPath = req.user.username
		var fullPath = path+userPath

		if(!fs.existsSync(fullPath)){
			fs.mkdirSync(fullPath)
		}

		cb(null, fullPath);
	},
	filename : (req, file, cb) => {
		cb(null, file.fieldname + '_' + Date.now() + '_' + file.originalname )
	}
})
const upload = multer({ storage : Storage }).array('avatar', 1)









const DataController = {}

DataController.isUserAuthed = (req,res,next) => {
	if(req.isAuthenticated()) next()
	else res.redirect('/')	
}

DataController.getUserInfo = (req, res, next) => {
	setTimeout(() => {
		if(req.user){
			res.send({user : req.user})
		} else {
			res.status(401).send()		
		}
	}, 3000)
}


DataController.userChangeAvatar = (req, res, next) => {
	l('DataController.userChangeAvatar')

	upload(req, res, function(error) {

		if(error){
			l('UPLOAD error : ',error)
			return res.send(error)
		}
		

		var file = req.files[0]
		l(file)
		var path = file.destination + '/' + file.filename
		var staticPath = path.split('./uploads')[1]

		dbApi.userChangeAvatar(req.user._id, staticPath)
			.then(
				result => { 
					return res.send(staticPath)
				},

				error => {
					l('userChangeAvatar error : ', error)

					return res.send(error)
				}
			)
	})
}



module.exports = DataController