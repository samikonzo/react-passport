var express = require('express')
var router = express.Router()
var auth = require('../controllers/AuthController')

router.post('/register', auth.doRegister)
router.post('/login', auth.doLogin)
router.get('/logout', auth.logout)
router.get('/loginStatus', auth.isLogged)
/*router.get('/loginStatus', (req, res) => {
	var status = req.isAuthenticated()
	l('status : ', status)
	res.send(status)
})*/












module.exports = router