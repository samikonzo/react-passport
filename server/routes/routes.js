var express = require('express')
var router = express.Router()
var auth = require('../controllers/AuthController')
var data = require('../controllers/DataController')




/**
*	Auth request
*/
router.post('/register', auth.doRegister)
router.post('/register/checkUsernameAvailable', auth.registerCheckUsernameAvailable)
router.post('/login', auth.doLogin)
router.get('/logout', auth.logout)
router.get('/authStatus', auth.authStatus)


/**
*	User
*/
router.get('/user', data.isUserAuthed ,data.getUserInfo)
router.post('/upload/user/avatar', data.isUserAuthed, data.userChangeAvatar)











module.exports = router