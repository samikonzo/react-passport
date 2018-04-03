const mongoose = require('mongoose')
const l = console.log
const db = require('../../etc/config.json').db


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
						setTimeout(db.connectToDatabase, 1000)
					}
				)
			
		})

	}
}

module.exports = dbApi