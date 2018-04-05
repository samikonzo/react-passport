import Dispatcher from '../dispatcher/AppDispatcher.js'
import Constants from '../constants/AppConstants.js'
import api from '../api/api.js'

const AppActions ={
	checkAuth(){
		//l(' ACTION : checkAuth')
		Dispatcher.dispatch({
			type: Constants.CHECK_AUTH_STARTED
		})

		api.checkAuth().then(
			result => {
				Dispatcher.dispatch({
					type: Constants.CHECK_AUTH_SUCCESS,
					data: result.data,
				})
			},
			err => {
				Dispatcher.dispatch({
					type: Constants.CHECK_AUTH_FAIL,
					error: err,
					err: err,
					data: err
				})
			}
		)
	},

	register(formdata){
		l(' ACTION : register')
		api.register(formdata)
			.then(
				ok => {


					var url = '/'
					Dispatcher.dispatch({
						type: Constants.REDIRECT_TO,
						data: url,
						url : url,
						href : url,
					})

					
					Dispatcher.dispatch({
						type: Constants.AFTER_REGISTRATION_LOGIN
					})
				},
				err => {
					Dispatcher.dispatch({
						type: Constants.REGISTRATION_FAIL,
						error: err,
						err: err,
						data: err,
					})
				}
			)
	},

	registerCheckUsernameFail(err){
		Dispatcher.dispatch({
			type: Constants.REGISTER_CHECK_USERNAME_FAIL,
			error: err,
			err: err,
			data: err
		})
	},

	registerCheckUsernameAvailable(username){
		Dispatcher.dispatch({
			type: Constants.REGISTER_CHECK_USERNAME_LOADING
		})

		api.registerCheckUsernameAvailable(username)
			.then(
				ok => {
					Dispatcher.dispatch({
						type: Constants.REGISTER_CHECK_USERNAME_SUCCESS
					})
				},
				err => {
					err = err.response.data 

					Dispatcher.dispatch({
						type: Constants.REGISTER_CHECK_USERNAME_FAIL,
						error: err,
						err: err,
						data: err,
					})
				},
			) 
	},

	registerCheckPasswordFail(err){
		Dispatcher.dispatch({
			type: Constants.REGISTER_CHECK_PASSWORD_FAIL,
			error: err,
			err: err,
			data: err
		})
	},

	registerCheckPasswordSuccess(){
		Dispatcher.dispatch({
			type: Constants.REGISTER_CHECK_PASSWORD_SUCCESS,
		})
	},

	registerClearFormState(){
		Dispatcher.dispatch({
			type: Constants.REGISTER_CLEAR_CHECK_FORM_STATE,
		})
	},

	login(formdata){
		//l(' ACTION : login')

		Dispatcher.dispatch({
			type: Constants.LOGIN_TRY
		})

		api.login(formdata)
			.then(
				result => {
					var url = '/'

					Dispatcher.dispatch({
						type: Constants.LOGIN_SUCCESS,
						data: result.data,
					})

					Dispatcher.dispatch({
						type: Constants.REDIRECT_TO,
						data: url,
						url : url,
						href : url,
					})
				
				},
				err => {
					l(' Login err : ', err)
					Dispatcher.dispatch({
						type: Constants.LOGIN_FAIL,
						result: err,
						err: err,
						error: err,
					})
				}
			)
	},

	setHistoryObj(obj){
		//l(' ACTION : setHistoryObj')
		Dispatcher.dispatch({
			type: Constants.SET_HISTORY_OBJECT,
			data: obj,
			object: obj,
			obj: obj,
		})
	},

	logout(){
		//l(' ACTION : logout')
		api.logout()
			.then(
				() => {
					var url = '/'

					Dispatcher.dispatch({
						type: Constants.REDIRECT_TO,
						data: url,
						url : url,
						href : url,
					})

					Dispatcher.dispatch({
						type: Constants.LOGOUT,
					})

				}
			)
	}
}

export default AppActions