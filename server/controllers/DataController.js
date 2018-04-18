const l = console.log

// database driver, api, schema
const mongoose = require('mongoose')
const User = require('../models/user.js')
const dbApi = require('../utils/databaseUtils.js')

// file uploading packets and options
const fs = require('fs')
const path = require('path')
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
		var originalName = file.originalname.split('__').join('-')


		cb(null, file.fieldname + '_' + Date.now() + '__' + file.originalname )
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

DataController.userSetAvatar = (req, res, next) => {
	l(req.body)
	dbApi.userUploadAvatar(req.user._id, req.body.imgSrc)
		.then(
			result => {
				return res.send(req.body.imgSrc)
			},
			error => {
				return res.send(error)
			}
		)
}

DataController.userUploadAvatar = (req, res, next) => {
	l('DataController.userUploadAvatar')

	upload(req, res, function(error) {
		if(error){
			l('UPLOAD error : ',error)
			return res.send(error)
		}

		var file = req.files[0]
		var path = file.destination + '/' + file.filename
		var staticPath = path.split('./uploads')[1]
	
		dbApi.userUploadAvatar(req.user._id, staticPath)
			.then(
				result => { 
					return res.send(staticPath)
				},

				error => {
					l('userUploadAvatar error : ', error)
					return res.send(error)
				}
			)


	})
}

DataController.userGetAllItems = (req, res, next) => {
	//l(req.user)
	var storagePath = './uploads/' + req.user.username

	if(!fs.existsSync(storagePath)){
		return res.status(204).send()
	}

	var files = fs.readdirSync(storagePath)

	files = files.map(filename => `./${req.user.username}/${filename}`)
	res.send(files)
}



DataController.userDeleteItem = (req, res, next) => {
	var imgSrc = req.body.imgSrc
	l(req.body)
	l(imgSrc)

	var filePath = path.join('./uploads/', imgSrc)
	l(filePath)

	if(!fs.existsSync(filePath)){
		return res.status(204).send()
	}

	setTimeout(() => {
		fs.unlinkSync(filePath)
		
		setTimeout(() => {
			res.status(200).send()
		}, 2000)
		
	}, 3000)

	// is avatar
	//l(req.user.avatar)


}

DataController._findFileInUploads = (filename) => {
	l('_findFileInUploads')
	return new Promise( (resolve, reject) => {
		l('_findFileInUploads Promise')
		var storagePath = './uploads/'
		var files = []

		recursiveSearch(storagePath)

		function recursiveSearch(dir){
			var filesInDir = fs.readdirSync(dir)

			l('dir : ', dir, filesInDir, filesInDir.length)

			for(var i = 0; i < filesInDir.length; i++){
				var file = filesInDir[i]
				var filename = path.join(dir, file)

				l('filename : ', filename)

				var stat = fs.lstatSync(filename)

				if(stat.isDirectory()){
					l(file + ' is directory')
					recursiveSearch(filename)
				} else {
					l(file + ' is file')
					files.push(filename)
				}

			}
		}


		var originalFilename = filename.split('__')[1].split('__').join('-')
		var regExp = new RegExp(originalFilename)
		files.forEach(file => {
			var match = file.match(originalFilename)
			l(match, originalFilename)
			if(match) resolve(file)
		})

		reject()
	})
}

module.exports = DataController