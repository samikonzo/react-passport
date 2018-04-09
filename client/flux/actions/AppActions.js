import Dispatcher from '../dispatcher/AppDispatcher.js'
import Constants from '../constants/AppConstants.js'
import api from '../api/api.js'

const AppActions ={
	/**
	*	Auth 
	*/
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
		l(' ACTION : login')

		Dispatcher.dispatch({
			type: Constants.LOGIN_TRY
		})

		api.login(formdata)
			.then(
				result => {
					var url = '/'

					Dispatcher.dispatch({
						type: Constants.LOGIN_SUCCESS,
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
	},

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
					err: err,
					data: err
				})
			}
		)
	},

	/**
	*	Page changing
	*/	
	setHistoryObj(obj){
		l(' ACTION : setHistoryObj')
		Dispatcher.dispatch({
			type: Constants.SET_HISTORY_OBJECT,
			data: obj,
			object: obj,
			obj: obj,
		})

		setTimeout(function f(){
			var dispatching = Dispatcher.isDispatching()
			l('dispatching : ', dispatching)
			if(dispatching){
				setTimeout(f, 1000)
			}

		}, 0)

	},

	popstate(e){
		l('ACTION : popstate')
		/*Dispatcher.dispatch({
			type : Constants.POP_STATE
		})*/
	},

	redirectTo(url){
		l('ACTION : redirectTo')
		Dispatcher.dispatch({
			type: Constants.REDIRECT_TO,
			data: url,
			url : url,
			href : url,
		})
	},


	/**
	*	User
	*/
	getUserInfo(){
		l('ACTION : getUserInfo')
		l(Dispatcher.isDispatching())

		Dispatcher.dispatch({
			type: Constants.LOADING,
		})

		setTimeout(() => {
			/*l(Dispatcher.isDispatching())
			Dispatcher.dispatch({
				type: Constants.LOADING,
			})

			api.getUserInfo()
				.then(
					user => {
						Dispatcher.dispatch({
							type: Constants.USER_GET_USER_INFO_SUCCESS,
							data: user.data,
							user: user.data,
						})
					},
					err => {
						Dispatcher.dispatch({
							type: Constants.USER_GET_USER_INFO_FAIL,
							result: err,
							err: err,
							error: err,
						})
					}
				)*/


			
		}, 0)

	},

}


var l = console.log;


function dispatchingCheck(fName, args){
	if(Dispatcher.isDispatching()){

		if(!Dispatcher._queue) Dispatcher._queue = []
		Dispatcher._queue.push({
			fName: fName,
			arguments: args,
		})	


		if(!Dispatcher._queueTimer){
			Dispatcher._queueTimer = setTimeout( function f(){

				if(Dispatcher.isDispatching()){
					Dispatcher._queueTimer = setTimeout( f, 100 )
				} else {

					if(Dispatcher._queue){
						var delayedF = Dispatcher._queue.pop()
						
						AppActions[delayedF.fname].apply(null, delayedF.arguments)

						if(!Dispatcher._queue.length){
							delete Dispatcher._queue
							delete Dispatcher._queueTimer	
						} else {
							Dispatcher._queueTimer = setTimeout( f, 100 )
						}
					}

				}

			}, 100)	
		} 

		return true
	} else {
		return false
	}
}

for(let fname in AppActions){
	let savedF = AppActions[fname]

	AppActions[fname] = () => {
		if(dispatchingCheck(fname, arguments))	return
	
		savedF.apply(null, arguments)
	}

	/*AppActions[fname] = function(){
		l(fname)
		

		if(Dispatcher.isDispatching()){
			if(!AppActions._queue){
				AppActions._queue = []
			}
			
			AppActions._queue.push({fname : fname, arguments: arguments})

			if(!AppActions._queueTimer){
				AppActions._queueTimer = setTimeout( function timerF(){
					if(Dispatcher.isDispatching()){
						AppActions._queueTimer = setTimeout(timerF, 100)
					} else {

						// dublicate =(
						if(AppActions._queue){
							var delayedF = AppActions._queue.pop()

							setTimeout(() => {
								AppActions[delayedF.fname].apply(null, delayedF.arguments)

								if(!AppActions._queue.length) delete AppActions._queue
							}, 100)
						} 
					}
				}, 100)
			}


			
		} else {
			savedF.apply(null, arguments)

			if(AppActions._queue){
				var delayedF = AppActions._queue.pop()

				setTimeout(() => {
					AppActions[delayedF.fname].apply(null, delayedF.arguments)

					if(!AppActions._queue.length) delete AppActions._queue
				}, 100)
			} 
		}
	}*/
}





export default AppActions