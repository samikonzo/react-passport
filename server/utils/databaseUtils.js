const mongoose = require('mongoose')
const l = console.log
const db = require('../../etc/config.json').db
const User = require('../models/user.js')


function tryConnectToDatabase(){
	return mongoose.connect(`mongodb://${db.host}:${db.port}/${db.name}`)
}


const dbApi = {
	connectToDatabase(){
		return new Promise( connected => {
			tryConnectToDatabase()
				.then( 
					resolve => {
						l('connected to database')
						connected()
					},
					err => {
						l('error connect to database')
						setTimeout(dbApi.connectToDatabase, 1000)
					}
				)
			
		})

	},

	userChangeAvatar(id, path){
		return new Promise( (resolve, reject) => {
			User.findById(id, (error, doc) => {
				if(error){
					l('User.findById error : ', error)
					reject(error)
				}

				doc.set({avatar : path})

				doc.save((error, ok) => {
					l('doc.save error : ', error)
					l('doc.save ok : ', ok)
					l('doc : ', doc)

					if(error){
						reject(error)
					}

					resolve(ok)

				})
			})
		})
	}

}

module.exports = dbApi