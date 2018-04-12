import Dispatcher from '../dispatcher/AppDispatcher.js'
import Constants from '../constants/AppConstants.js'
import api from '../api/api.js'

const l = console.log;

const AppActions ={
	/**
	*	Register
	*/
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



	/**
	*	Auth 
	*/
	authCheckAuth(){
		Dispatcher.dispatch({
			type: Constants.AUTH_CHECK_AUTH_STARTED
		})

		api.checkAuth().then(
			result => {
				var authed = result.data

				if(authed){
					var url = '/'
					Dispatcher.dispatch({
						type: Constants.PAGE_REDIRECT_TO,
						data: url,
						url : url,
						href : url,
					})
				}

				/**/

				Dispatcher.dispatch({
					type: Constants.AUTH_CHECK_AUTH_SUCCESS,
					data: authed,
				})
			},
			error => {
				l(error)
				/*var url = '/'
					Dispatcher.dispatch({
						type: Constants.PAGE_REDIRECT_TO,
						data: url,
						url : url,
						href : url,
					})*/

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

	/**
	*	User
	*/
	userChangeAvatar(formdata){
		Dispatcher.dispatch({
			type: Constants.USER_CHANGE_AVATAR
		})

		api.userChangeAvatar(formdata)
			.then(
				result => {

					l('userChangeAvatar result : ', result)

					Dispatcher.dispatch({
						type: Constants.USER_CHANGE_AVATAR_SUCCESS,
						//img : result.data
					})
				},

				error => {

					l('userChangeAvatar error : ', error)
					
					Dispatcher.dispatch({
						type: Constants.USER_CHANGE_AVATAR_FAIL,
						//img : result.data
					})
				}
			)
	},

	/**
	*	Page changing
	*/	
	pageSetHistoryObj(obj){
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
		/*Dispatcher.dispatch({
			type : Constants.POP_STATE
		})*/
	},

	pageRedirectTo(url){
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
						
						//l('AppActions : ', fName)

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