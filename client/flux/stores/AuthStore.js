import Dispatcher from '../dispatcher/AppDispatcher.js'
import Constants from '../constants/AppConstants.js'
import { EventEmitter } from 'events'


const events = {
	'CHANGE_STATE' : 'CHANGE_STATE',
}

const initState = {
	Auth_isLoading 	: false,
	Auth_isLogged 	: false,
	Auth_error 		: false,
	Auth_message 	: undefined,
	Auth_user 		: undefined,
	Auth_userError 	: false,
	Auth_userIsLoading : false,	
	Auth_firstCheck : false,
}

var state = Object.assign({}, initState)


Dispatcher.register( function(action){
	switch(action.type){

		/**
		*	Auth
		*/

		case Constants.AUTH_CHECK_AUTH_STARTED : {
			//l('AUTH_CHECK_AUTH_STARTED')
			state.Auth_isLoading = true
			AuthStore.emitChange(' CHECK_AUTH_STARTED ')
			break;
		}

		case Constants.AUTH_CHECK_AUTH_SUCCESS : {
			//l('AUTH_CHECK_AUTH_SUCCESS')
			var result = action.data
			if(result){
				state.Auth_isLogged = true
				state.Auth_user = result
			}
			else state.Auth_isLogged = false

			state.Auth_isLoading = false
			state.Auth_firstCheck = true

			AuthStore.emitChange('CHECK_AUTH_SUCCESS')
			break;
		}

		case Constants.AUTH_CHECK_AUTH_FAIL : {
			//l('AUTH_CHECK_AUTH_FAIL')
			var error = action.error
			l(error)

			state.Auth_isLoading = false
			state.Auth_firstCheck = true
			l(action)

			AuthStore.emitChange(' CHECK_AUTH_FAIL ')
			break;
		}

		case Constants.AUTH_LOGIN_TRY : {
			//l('AUTH_LOGIN_TRY')
			//l(action)
			state.Auth_isLoading = true
			AuthStore.emitChange(' LOGIN_TRY ')
			break;
		}

		case Constants.AUTH_LOGIN_SUCCESS : {
			//l('AUTH_LOGIN_SUCCESS')
			state.Auth_isLoading = false	
			state.Auth_isLogged = true
			state.Auth_error = false
			state.Auth_user = action.data
			//state.Auth_message = action.message

			AuthStore.emitChange(' LOGIN_SUCCESS ')
			break;
		}

		case Constants.AUTH_LOGIN_FAIL : {
			var message, input

			if(action.message != 'Unauthorized'){
				message = action.message
				input = 'username'
			} else {
				message = 'wrong password'
				input = 'password'
			}

			//l('AUTH_LOGIN_FAIL')
			state.Auth_isLoading = false
			state.Auth_isLogged = false
			state.Auth_error = {
				message : message,
				input: input,
			}
			state.Auth_message = action.message 

			//l(state)

			AuthStore.emitChange(' LOGIN_FAIL ')
			break;
		}

		case Constants.AUTH_AFTER_REGISTRATION_LOGIN : {
			//l('AUTH_AFTER_REGISTRATION_LOGIN')
			state.Auth_isLoading = false
			state.Auth_isLogged = true;
			state.Auth_error = false
			state.Auth_message = undefined
			break;
		}

		case Constants.AUTH_LOGOUT : {
			//l('AUTH_LOGOUT')
			state = Object.assign({}, initState)
			/*state.Auth_isLoading = false
			state.Auth_isLogged = false
			state.Auth_error = false
			state.Auth_message = undefined
			state.Auth_user = undefined*/
			AuthStore.emitChange(' LOGOUT ')
			break;
		}

		case Constants.AUTH_GET_USER_INFO_STARTED : {
			//l('AUTH_GET_USER_INFO_STARTED', action)
			state.Auth_userIsLoading = true
			AuthStore.emitChange(' AUTH_GET_USER_INFO_STARTED ')
			break;
		}

		case Constants.AUTH_GET_USER_INFO_SUCCESS : { 
			//l('AUTH_GET_USER_INFO_SUCCESS')
			state.Auth_userIsLoading = false
			state.Auth_user = action.user

			AuthStore.emitChange(' AUTH_GET_USER_INFO_SUCCESS ')
			break;
		}

		case Constants.AUTH_GET_USER_INFO_FAIL : { 
			//l('AUTH_GET_USER_INFO_FAIL')
			state.Auth_userIsLoading = false
			state.Auth_user = undefined
			state.Auth_userError = action.error
			AuthStore.emitChange(' AUTH_GET_USER_INFO_FAIL ')
			break;
		}

		/**
		*	User 
		*/

		case Constants.USER_CHANGE_AVATAR : {
			l('USER_CHANGE_AVATAR')
			break;
		}
		case Constants.USER_CHANGE_AVATAR_SUCCESS : {
			l('USER_CHANGE_AVATAR_SUCCESS')
			break;
		}
		case Constants.USER_CHANGE_AVATAR_FAIL : {
			l('USER_CHANGE_AVATAR_FAIL')
			break;
		}		


		default : {
			//l(action)
		}
	}
})	

const AuthStore = Object.assign({}, EventEmitter.prototype, {
	/**
	*	Auth State Changing
	*/

	addChangeListener(f){
		this.on(events.CHANGE_STATE, f)
	},

	removeChangeListener(f){
		this.removeListener(events.CHANGE_STATE, f)
	},

	emitChange(from){
		this.emit(events.CHANGE_STATE)
	},

	getState(){
		//l(state)
		return state
	},


	/**
	*	User
	*/

	getUserInfo(){
		//l(state.Auth_user)
		return state.Auth_user
	}

})





export default AuthStore