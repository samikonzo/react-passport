const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const path = require('path')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const routes = require('./routes/routes.js')
const dbApi = require('./utils/databaseUtils.js')
const User = require('./models/user.js')

global.l = console.log

// request logger
app.use((req, res, next) => {
	l(req.method, req.url)
	next()
})


/* DATA BASE */
dbApi.connectToDatabase()
//////////////


// main use's
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
	secret: '512756t87gw',
	resave: 'false',
	cookie: {
		maxAge: 60000
	}
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use('/', routes)
//////////////

app.use(express.static(path.join(__dirname, '../', '/public')))


// session id
/*app.use( (req, res, next) => {
	if(req.session){
		l('2. sessionId : ', req.session.id)
	}
	next()
})
*/




app.get(/.*/, function root(req, res){
	res.sendFile(path.join(__dirname, '../', 'public/index.html'))
})

app.listen(3000)