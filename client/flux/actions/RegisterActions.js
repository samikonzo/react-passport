import Dispatcher from '../dispatcher/AppDispatcher.js'
import Constants from '../constants/AppConstants.js'
import api from '../api/api.js'

export default {
	register(formdata){
		Dispatcher.dispatch({
			type: Constants.REGISTRATION_WAIT
		})

		api.register(formdata)
			.then(
				ok => {

					Dispatcher.dispatch({
						type: Constants.REGISTRATION_SUCCESS
					})

					var url = '/'
					Dispatcher.dispatch({
						type: Constants.PAGE_REDIRECT_TO,
						data: url,
						url : url,
						href : url,
					})
					
					Dispatcher.dispatch({
						//type: Constants.AFTER_REGISTRATION_LOGIN
						type: Constants.AUTH_LOGIN_SUCCESS
					})

					
				},

				error => {
					Dispatcher.dispatch({
						type: Constants.REGISTRATION_FAIL,
						error: error,
						error: error,
						data: error,
					})
				}
			)
	},

	registerSetUsername(username){
		Dispatcher.dispatch({
			type: Constants.REGISTER_SET_USERNAME,
			username: username,
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
						type: Constants.REGISTER_CHECK_USERNAME_SUCCESS,
						username: username,
					})
				},
				error => {
					error = error.response.data 

					Dispatcher.dispatch({
						type: Constants.REGISTER_CHECK_USERNAME_FAIL,
						error: error,
						username: username,
					})
				},
			) 
	},

	registerCheckUsernameFail(error, username){
		Dispatcher.dispatch({
			type: Constants.REGISTER_CHECK_USERNAME_FAIL,
			error: error,
			username: username,
		})
	},

	registerCheckPasswordFail(error){
		Dispatcher.dispatch({
			type: Constants.REGISTER_CHECK_PASSWORD_FAIL,
			error: error,
		})
	},

	registerCheckPasswordSuccess(){
		Dispatcher.dispatch({
			type: Constants.REGISTER_CHECK_PASSWORD_SUCCESS,
		})
	},

	registerClearFormState(){
		Dispatcher.dispatch({
			type: Constants.REGISTER_CLEAR_FORM_STATE,
		})
	},
}