import Dispatcher from '../dispatcher/AppDispatcher.js'
import Constants from '../constants/AppConstants.js'
import { EventEmitter } from 'events'


const events = {
	'CHANGE_STATE' : 'CHANGE_STATE',
}


const state = {
	Auth_isLoading 	: false,
	Auth_isLogged 	: false,
	Auth_error 		: false,
	Auth_message 	: undefined,
	Auth_user 		: undefined,
}


Dispatcher.register( function(action){
	switch(action.type){

		case Constants.AUTH_CHECK_AUTH_STARTED : {
			//l(' CHECK_AUTH_STARTED ')
			l('Auth_isLoading')
			state.Auth_isLoading = true
			AuthStore.emitChange(' CHECK_AUTH_STARTED ')
			break;
		}

		case Constants.AUTH_CHECK_AUTH_SUCCESS : {
			//l(' CHECK_AUTH_SUCCESS ')
			var result = action.data

			if(result) state.Auth_isLogged = true
			else state.Auth_isLogged = false

			l('Auth_isLoading')
			state.Auth_isLoading = false

			AuthStore.emitChange('CHECK_AUTH_SUCCESS')
			break;
		}

		case Constants.AUTH_CHECK_AUTH_FAIL : {
			//l(' CHECK_AUTH_FAIL ')
			var err = action.error
			l(err)

			l('Auth_isLoading')
			state.Auth_isLoading = false

			AuthStore.emitChange(' CHECK_AUTH_FAIL ')
			break;
		}

		case Constants.AUTH_LOGIN_TRY : {
			l(' LOGIN_TRY ')
			l('Auth_isLoading')
			l(action)
			state.Auth_isLoading = true
			AuthStore.emitChange(' LOGIN_TRY ')
			break;
		}

		case Constants.AUTH_LOGIN_SUCCESS : {
			l('Auth_isLoading')
			state.Auth_isLoading = false	
			state.Auth_isLogged = true
			state.Auth_error = false
			state.Auth_message = action.message

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

			//l(' LOGIN_FAIL ')
			l('Auth_isLoading')
			state.Auth_isLoading = false
			state.Auth_isLogged = false
			state.Auth_error = {
				message : message,
				input: input,
			}
			state.Auth_message = action.message 

			

			AuthStore.emitChange(' LOGIN_FAIL ')
			break;
		}

		case Constants.AUTH_AFTER_REGISTRATION_LOGIN : {
			//l(' AFTER_REGISTRATION_LOGIN ')
			l('Auth_isLoading')
			state.Auth_isLoading = false
			state.Auth_isLogged = true;
			state.Auth_error = false
			state.Auth_message = undefined
			break;
		}

		case Constants.AUTH_LOGOUT : {
			l('Auth_isLoading')
			state.Auth_isLoading = false
			state.Auth_isLogged = false
			state.Auth_error = false
			state.Auth_message = undefined
			AuthStore.emitChange(' LOGOUT ')
			break;
		}

		case Constants.AUTH_GET_USER_INFO_SUCCESS : { 
			l('Auth_isLoading')
			/*state.Auth_isLoading = false
			state.Auth_user = action.Auth_user
			l('Auth_user : ', state.Auth_user)
			AuthStore.emitChange()*/
			break;
		}

		case Constants.AUTH_GET_USER_INFO_FAIL : { 
			l('Auth_isLoading')
			/*state.Auth_isLoading = false
			state.Auth_user = 'no Auth_user info'
			l('err : ', action.err)
			AuthStore.emitChange()*/
			break;
		}

		default : {
			l(action)
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
		return state
	},


	/**
	*	User
	*/

	getUserInfo(){
		return state.Auth_user
	}

})





export default AuthStore