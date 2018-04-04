import Dispatcher from '../dispatcher/AppDispatcher.js'
import Constants from '../constants/AppConstants.js'
import api from '../api/api.js'

const AppActions ={
	checkAuth(){
		l(' ACTION : checkAuth')
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
					Dispatcher.dispatch({
						type: Constants.AFTER_REGISTRATION_LOGIN
					})


					var url = '/'

					Dispatcher.dispatch({
						type: Constants.REDIRECT_TO,
						data: url,
						url : url,
						href : url,
					})

				},
				err => {}
			)
	},

	login(formdata){
		l(' ACTION : login')

		Dispatcher.dispatch({
			type: Constants.LOGIN_TRY
		})

		api.login(formdata)
			.then(
				result => {
					var url = '/'

					Dispatcher.dispatch({
						type: Constants.LOGIN_RESULT,
						data: result.data,
					})

					Dispatcher.dispatch({
						type: Constants.REDIRECT_TO,
						data: url,
						url : url,
						href : url,
					})
				
				},
				err => {}
			)
	},

	setHistoryObj(obj){
		l(' ACTION : setHistoryObj')
		Dispatcher.dispatch({
			type: Constants.SET_HISTORY_OBJECT,
			data: obj,
			object: obj,
			obj: obj,
		})
	},

	logout(){
		l(' ACTION : logout')
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

	/*
		actionName(){
			Dispatcher.dispatch({
				type: Constants.ACTION_CONSTATN_NAME
			})

			api.apiFunc().then(
				data => { 
					Dispatcher.dispatch({
						type: Constants.RESPONSE_CONSTANT_NAME,
						data: data})
				},

				err => { }
			)

		}
	*/
}

export default AppActions