import Dispatcher from '../dispatcher/AppDispatcher.js'
import Constants from '../constants/AppConstants.js'
import { EventEmitter } from 'events'

const events = {
	CHANGE_STATE : 'CHANGE_STATE',
}

var initState = {
	usernameLoading : false,
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
	}
}

var state = Object.assign({}, initState) 

Dispatcher.register((action) => {
	switch(action.type){

		case Constants.REGISTRATION_FAIL : {
			l('REGISTRATION_FAIL')
			break;
		}

		case Constants.REGISTER_CHECK_USERNAME_FAIL : {
			var err = action.err
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
			state.errors.usernameError.message = undefined
			state.usernameAvailable = undefined
			RegisterStore.emitChange()
			break;
		}

		case Constants.REGISTER_CHECK_USERNAME_SUCCESS : {
			state.usernameLoading = false
			state.errors.usernameError.error = false
			state.errors.usernameError.message = undefined
			state.usernameAvailable = true

			RegisterStore.emitChange()
			break;
		}

		case Constants.REGISTER_CHECK_PASSWORD_FAIL : {
			var err = action.err

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

		case Constants.REGISTER_CLEAR_CHECK_FORM_STATE : {
			l('REGISTER_CLEAR_CHECK_FORM_STATE')
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