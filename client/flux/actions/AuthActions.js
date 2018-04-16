import Dispatcher from '../dispatcher/AppDispatcher.js'
import Constants from '../constants/AppConstants.js'
import api from '../api/api.js'

export default {
	authCheckAuth(){
		Dispatcher.dispatch({
			type: Constants.AUTH_CHECK_AUTH_STARTED
		})

		api.checkAuth().then(
			result => {
				var isAuthed = ( result.data != false )

				if(isAuthed){
					var url = '/'
					Dispatcher.dispatch({
						type: Constants.PAGE_REDIRECT_TO,
						data: url,
						url : url,
						href : url,
					})
				}

				
				Dispatcher.dispatch({
					type: Constants.AUTH_CHECK_AUTH_SUCCESS,
					data: result.data,
				})


			},
			error => {
				l(error)

				Dispatcher.dispatch({
					type: Constants.AUTH_CHECK_AUTH_FAIL,
					error: error,
				})
			}
		)
	},

	authCheckAuthSilent(){
		api.checkAuth().then(
			result => {

				var now = new Date()
				var h = now.getHours()
				if(h.toString().length < 2) h = '0' + h
				var m = now.getMinutes()
				if(m.toString().length < 2) m = '0' + m
				var s = now.getSeconds()
				if(s.toString().length < 2) s = '0' + s
				l(`${h}:${m}:${s}  : ${!!result.data}`)

				Dispatcher.dispatch({
					type: Constants.AUTH_CHECK_AUTH_SUCCESS,
					data: result.data,
				})
			},
			error => {
				l(error)

				Dispatcher.dispatch({
					type: Constants.AUTH_CHECK_AUTH_FAIL,
					error: error,
				})
			}
		)
	},

	authLogin(formdata){
		Dispatcher.dispatch({
			type: Constants.AUTH_LOGIN_TRY
		})

		api.login(formdata)
			.then(
				result => {
					var url = '/'
					Dispatcher.dispatch({
						type: Constants.PAGE_REDIRECT_TO,
						data: url,
						url : url,
						href : url,
					})

					Dispatcher.dispatch({
						type: Constants.AUTH_LOGIN_SUCCESS,
						data: result.data
					})
				},
				error => {
					Dispatcher.dispatch({
						type: Constants.AUTH_LOGIN_FAIL,
						error: error,
						message: error.response.data,
					})
				}
			)
	},

	authLogout(){
		api.logout()
			.then(
				() => {
					Dispatcher.dispatch({
						type: Constants.AUTH_LOGOUT,
					})

					var url = '/'

					Dispatcher.dispatch({
						type: Constants.PAGE_REDIRECT_TO,
						data: url,
						url : url,
						href : url,
					})


				}
			)
	},

	authGetUserInfo(){
		l(Dispatcher.isDispatching())

		Dispatcher.dispatch({
			type: Constants.AUTH_GET_USER_INFO_STARTED,
			time: performance.now(),
		})

		api.getUserInfo()
			.then(
				result => {
					//l(result)

					Dispatcher.dispatch({
						type: Constants.AUTH_GET_USER_INFO_SUCCESS,
						user: result.data.user,
					})
				},
				error => {
					Dispatcher.dispatch({
						type: Constants.AUTH_GET_USER_INFO_FAIL,
						error: error,
					})
				}
			)
	},
}