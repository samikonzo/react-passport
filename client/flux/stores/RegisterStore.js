import Dispatcher from '../dispatcher/AppDispatcher.js'
import Constants from '../constants/AppConstants.js'
import { EventEmitter } from 'events'

const events = {
	CHANGE_STATE : 'CHANGE_STATE',
}

var initState = {
	usernameLoading : false,
	username : undefined,
	usernameAvailable : undefined,
	
	passwordLoading : false,
	passwordAvailable : undefined,

	errors : {
		registrationError : {
			error : false,
			message: undefined,
		},

		usernameError : {
			error : false,
			message: undefined,
		},

		passwordError : {
			error : false,
			message : undefined,
		}
	},

	waiting : false, // waiting response from server
	registred : false, // already registred
}

var state = Object.assign({}, initState) 

Dispatcher.register((action) => {
	switch(action.type){

		case Constants.REGISTRATION_WAIT : {
			state.waiting = true
			RegisterStore.emitChange()
			break;
		}

		case Constants.REGISTRATION_FAIL : {
			state.waiting = false
			RegisterStore.emitChange()
			break;
		}

		case Constants.REGISTRATION_SUCCESS : {
			state.waiting = false
			state.registred = true
			RegisterStore.emitChange()
			break;
		}

		case Constants.REGISTER_SET_USERNAME : {
			state.username = action.username
			break;
		}

		case Constants.REGISTER_CHECK_USERNAME_FAIL : {
			var err = action.error
			var checkedUsername = action.username

			if(checkedUsername != state.username){
				l('REGISTER_CHECK_USERNAME_FAIL')
				l(checkedUsername, '!=', state.username)

				return	
			} 

			state.usernameLoading = false
			state.errors.usernameError.error = true
			state.errors.usernameError.message = err
			state.usernameAvailable = false

			RegisterStore.emitChange()
			break;
		}

		case Constants.REGISTER_CHECK_USERNAME_LOADING : {
			state.usernameLoading = true
			state.errors.usernameError.error = false
			//state.errors.usernameError.message = undefined
			state.usernameAvailable = undefined
			RegisterStore.emitChange()
			break;
		}

		case Constants.REGISTER_CHECK_USERNAME_SUCCESS : {
			var checkedUsername = action.username
			if(checkedUsername != state.username) return

			state.usernameLoading = false
			state.errors.usernameError.error = false
			//state.errors.usernameError.message = undefined
			state.usernameAvailable = true

			RegisterStore.emitChange()
			break;
		}

		case Constants.REGISTER_CHECK_PASSWORD_FAIL : {
			var err = action.error

			state.passwordAvailable = false
			state.errors.passwordError.error = true
			state.errors.passwordError.message = err

			RegisterStore.emitChange()
			break;
		}

		case Constants.REGISTER_CHECK_PASSWORD_SUCCESS : {
			state.passwordAvailable = true
			state.errors.passwordError.error = false
			state.errors.passwordError.message = undefined

			RegisterStore.emitChange()
			break;
		}

		case Constants.REGISTER_CLEAR_FORM_STATE : {
			l('REGISTER_CLEAR_FORM_STATE')
			state = Object.assign({}, initState) 
			RegisterStore.emitChange()
			break;
		}

	}
})


const RegisterStore = Object.assign({}, EventEmitter.prototype, {
	/**
	*	state Changing
	*/
	addChangeListener(f){
		this.on(events.CHANGE_STATE, f)
	},

	removeChangeListener(f){
		this.removeListener(events.CHANGE_STATE, f)
	},

	emitChange(){
		this.emit(events.CHANGE_STATE)
	},

	getState(){
		return state
	},


	/**
	*	user name
	*/
	
})


export default RegisterStore