import Dispatcher from '../dispatcher/AppDispatcher.js'
import Constants from '../constants/AppConstants.js'
import { EventEmitter } from 'events'

const events = {
	CHANGE_STATE : 'CHANGE_STATE',
}

const state = {
	usernameLoading : false,
	usernameAvailable : undefined,
}


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
	}
})


export default RegisterStore