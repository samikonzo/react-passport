import Dispatcher from '../dispatcher/AppDispatcher.js'
import Constants from '../constants/AppConstants.js'
import api from '../api/api.js'

const l = console.log;

const AppActions ={
	/**
	*	Register
	*/
	register(formdata){
		l('register')
		//l(' ACTION : register')

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
		l('registerCheckUsernameFail')
		Dispatcher.dispatch({
			type: Constants.REGISTER_CHECK_USERNAME_FAIL,
			error: err,
			err: err,
			data: err
		})
	},

	registerCheckUsernameAvailable(username){
		l('registerCheckUsernameAvailable')
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
		l('registerCheckPasswordFail')
		Dispatcher.dispatch({
			type: Constants.REGISTER_CHECK_PASSWORD_FAIL,
			error: err,
			err: err,
			data: err
		})
	},

	registerCheckPasswordSuccess(){
		l('registerCheckPasswordSuccess')
		Dispatcher.dispatch({
			type: Constants.REGISTER_CHECK_PASSWORD_SUCCESS,
		})
	},

	registerClearFormState(){
		l('registerClearFormState')
		Dispatcher.dispatch({
			type: Constants.REGISTER_CLEAR_FORM_STATE,
		})
	},



	/**
	*	Auth 
	*/
	authLogin(formdata){
		l('authLogin')
		l(' ACTION : login')
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
						message: result.data
					})

				
				},
				err => {
					Dispatcher.dispatch({
						type: Constants.AUTH_LOGIN_FAIL,
						error: err,
						message: err.response.data,
					})
				}
			)
	},

	authLogout(){
		l('authLogout')
		//l(' ACTION : logout')
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

	authCheckAuth(){
		l('authCheckAuth')
		//l(' ACTION : checkAuth')
		Dispatcher.dispatch({
			type: Constants.AUTH_CHECK_AUTH_STARTED
		})

		api.checkAuth().then(
			result => {
				Dispatcher.dispatch({
					type: Constants.AUTH_CHECK_AUTH_SUCCESS,
					data: result.data,
				})
			},
			err => {
				Dispatcher.dispatch({
					type: Constants.AUTH_CHECK_AUTH_FAIL,
					error: err,
					err: err,
					data: err
				})
			}
		)
	},

	authGetUserInfo(){
		l('authGetUserInfo')
		//l('ACTION : getUserInfo')
		l(Dispatcher.isDispatching())

		Dispatcher.dispatch({
			type: Constants.AUTH_LOADING,
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


	/**
	*	Page changing
	*/	
	pageSetHistoryObj(obj){
		l('pageSetHistoryObj')
		//l(' ACTION : setHistoryObj')
		Dispatcher.dispatch({
			type: Constants.PAGE_SET_HISTORY_OBJECT,
			data: obj,
			object: obj,
			obj: obj,
		})

		setTimeout(function f(){
			var dispatching = Dispatcher.isDispatching()
			//l('dispatching : ', dispatching)
			if(dispatching){
				setTimeout(f, 1000)
			}

		}, 0)
	},

	pagePopstate(e){
		l('pagePopstate')
		//l('ACTION : popstate')
		/*Dispatcher.dispatch({
			type : Constants.POP_STATE
		})*/
	},

	pageRedirectTo(url){
		l('pageRedirectTo')
		//l('ACTION : redirectTo')
		Dispatcher.dispatch({
			type: Constants.PAGE_REDIRECT_TO,
			data: url,
			url : url,
			href : url,
		})
	},
}



/**
*	Dispatchers multiRequest issue fix
* 	by creating queue of requests
*/

function dispatchingCheck(fName, args){
	/**
	*	check Dispatcher.isDispatching
		if Dispather not buzy return false 
		else 
			return true (and prevent original func) 
			create queue (if not exist)
			add
			

	*/

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

						// wrong method, cuz delayedF must get first _queue object
						// var delayedF = Dispatcher._queue.pop()
						var delayedF = Dispatcher._queue.splice(0,1)[0]
						
						AppActions[delayedF.fName].apply(null, delayedF.arguments)

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

for(let fName in AppActions){
	let savedF = AppActions[fName]

	AppActions[fName] = function(){
		if(dispatchingCheck(fName, arguments))	return
	
		//l('AppActions -', fName, ' : ', arguments)
		savedF.apply(null, arguments)
	}
}

//////////////////////////////////////



export default AppActions