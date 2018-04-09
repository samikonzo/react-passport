import Dispatcher from '../dispatcher/AppDispatcher.js'
import Constants from '../constants/AppConstants.js'
import { EventEmitter } from 'events'


const events = {
	'CHANGE_STATE' : 'CHANGE_STATE',
}


const state = {
	isLoading : false,
	isLogged : false,
	/*error : false,
	message : false,*/
	user: undefined,
	/*isLoading: false,
	isLogged: false,
	_historyObj: undefined,
	error : false,
	message : undefined,
	user: undefined,*/
}


Dispatcher.register( function(action){
	switch(action.type){

		case Constants.AUTH_CHECK_AUTH_STARTED : {
			//l(' CHECK_AUTH_STARTED ')
			state.isLoading = true
			AppStore.emitChange(' CHECK_AUTH_STARTED ')
			break;
		}

		case Constants.AUTH_CHECK_AUTH_SUCCESS : {
			//l(' CHECK_AUTH_SUCCESS ')
			var result = action.data

			if(result) state.isLogged = true
			else state.isLogged = false

			state.isLoading = false

			AppStore.emitChange('CHECK_AUTH_SUCCESS')
			break;
		}

		case Constants.AUTH_CHECK_AUTH_FAIL : {
			//l(' CHECK_AUTH_FAIL ')
			var err = action.error
			l(err)

			state.isLoading = false

			AppStore.emitChange(' CHECK_AUTH_FAIL ')
			break;
		}

		case Constants.AUTH_LOGIN_TRY : {
			//l(' LOGIN_TRY ')
			state.isLoading = true
			AppStore.emitChange(' LOGIN_TRY ')
			break;
		}

		case Constants.AUTH_LOGIN_SUCCESS : {
			//l(' LOGIN_SUCCESS ')
			// TODO : smooth reload page through PageChange

			AppStore.emitPagePreChange()
				.then(() => {
					state.isLoading = false
					state.isLogged = true
					state.error = false
					state.message = undefined
				
					AppStore.emitChange(' LOGIN_SUCCESS ')
				})

			break;
		}

		case Constants.AUTH_LOGIN_FAIL : {
			//l(' LOGIN_FAIL ')
			state.isLoading = false
			state.error = true
			state.message = 'wrong pair login / password'

			AppStore.emitChange(' LOGIN_FAIL ')
			break;
		}

		case Constants.AUTH_AFTER_REGISTRATION_LOGIN : {
			//l(' AFTER_REGISTRATION_LOGIN ')
			state.isLogged = true;
			
			break;
		}

		case Constants.AUTH_LOGOUT : {
			state.isLogged = false
			break;
		}

		case Constants.AUTH_LOADING : {
			//state.isLoading = true
			//AppStore.emitChange(' LOADING ')
		}

		case Constants.AUTH_GET_USER_INFO_SUCCESS : { 
			/*state.isLoading = false
			state.user = action.user
			l('user : ', state.user)
			AppStore.emitChange()*/
			break;
		}

		case Constants.AUTH_GET_USER_INFO_FAIL : { 
			/*state.isLoading = false
			state.user = 'no user info'
			l('err : ', action.err)
			AppStore.emitChange()*/
			break;
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
		return state.user
	}

})





export default AuthStore