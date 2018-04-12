const mongoose = require('mongoose')
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
const upload = multer({ storage : Storage }).array('avatar', 3)









const l = console.log



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

	upload(req, res, function(err) {
		l(req.body)
		l(req.file)
		l(req.files)

		if(err){
			l(err)
			return res.end('something wrong')
		}
		
		return res.end('success upload')
	})
}



module.exports = DataController