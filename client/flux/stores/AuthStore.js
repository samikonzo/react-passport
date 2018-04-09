import Dispatcher from '../dispatcher/AppDispatcher.js'
import Constants from '../constants/AppConstants.js'
import { EventEmitter } from 'events'


const events = {
	'CHANGE_STATE' : 'CHANGE_STATE',
}


const state = {
	isLoading: false,
	isLogged: false,
	_historyObj: undefined,
	error : false,
	message : undefined,
	user: undefined,
}


Dispatcher.register( function(action){
	switch(action.type){

		case Constants.CHECK_AUTH_STARTED : {
			//l(' CHECK_AUTH_STARTED ')
			state.isLoading = true
			AppStore.emitChange(' CHECK_AUTH_STARTED ')
			break;
		}

		case Constants.CHECK_AUTH_SUCCESS : {
			//l(' CHECK_AUTH_SUCCESS ')
			var result = action.data

			if(result) state.isLogged = true
			else state.isLogged = false

			state.isLoading = false

			AppStore.emitChange('CHECK_AUTH_SUCCESS')
			break;
		}

		case Constants.CHECK_AUTH_FAIL : {
			//l(' CHECK_AUTH_FAIL ')
			var err = action.error
			l(err)

			state.isLoading = false

			AppStore.emitChange(' CHECK_AUTH_FAIL ')
			break;
		}

		case Constants.LOGIN_TRY : {
			//l(' LOGIN_TRY ')
			state.isLoading = true
			AppStore.emitChange(' LOGIN_TRY ')
			break;
		}

		case Constants.LOGIN_SUCCESS : {
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

		case Constants.LOGIN_FAIL : {
			//l(' LOGIN_FAIL ')
			state.isLoading = false
			state.error = true
			state.message = 'wrong pair login / password'

			AppStore.emitChange(' LOGIN_FAIL ')
			break;
		}

		case Constants.AFTER_REGISTRATION_LOGIN : {
			//l(' AFTER_REGISTRATION_LOGIN ')
			state.isLogged = true;
			
			break;
		}

		case Constants.LOGOUT : {
			state.isLogged = false
			break;
		}

		case Constants.LOADING : {
			//state.isLoading = true
			//AppStore.emitChange(' LOADING ')
		}

		case Constants.USER_GET_USER_INFO_SUCCESS : { 
			/*state.isLoading = false
			state.user = action.user
			l('user : ', state.user)
			AppStore.emitChange()*/
			break;
		}

		case Constants.USER_GET_USER_INFO_FAIL : { 
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
	*	Page Changing
	*	1) run all pagePreaparing promise funcs
	*	2) after resolve of pagePrepare promise run page change
	*/

	addPageChangeListener(pagePreaparing, pageChange){
		this.on(events.PAGE_PRE_CHANGE, pagePreaparing)
		if(pageChange != undefined) this.on(events.PAGE_CHANGE, pageChange)
	},

	removePageChangeListener(pagePreaparing, pageChange){
		this.removeListener(events.PAGE_PRE_CHANGE, pagePreaparing)
		if(pageChange != undefined) this.removeListener(events.PAGE_CHANGE, pageChange)
	},

	emitPagePreChange(){
		return new Promise( (resolve, reject) => {
			var listenersFuncs = this.listeners(events.PAGE_PRE_CHANGE)
			var promisesFuncs = 0
			var promisesReady = 0

			l(listenersFuncs)

			listenersFuncs.forEach(f => {
				var result = f()
				if(result && result.then){
					promisesFuncs++

					result.then(
						fReady => {
							//l('+1 resolved')
							promisesReady++

							if(checkAllReady){
								//l('all ready')
								resolve()
							}
						}
					)
				}
			})

			if(!promisesFuncs){
				//l('all ready')
				resolve()
			}

			function checkAllReady(){
				//l('promisesReady : ', promisesReady)
				//l('promisesFuncs :', promisesFuncs)
				return promisesReady == promisesFuncs
			}
		})
	},

	emitPageChange(){
		this.emit(events.PAGE_CHANGE)
	},

	redirectTo(url){
		// TODO : At first - emitPagePreChange
		l(state._historyObj)
		state._historyObj.push(url)
	},

	/**
	*	state Changing
	*/

	addChangeListener(f){
		this.on(events.CHANGE_STATE, f)
	},

	removeChangeListener(f){
		this.removeListener(events.CHANGE_STATE, f)
	},

	emitChange(from){
		l(' STORE : EMIT CHANGE', from )
		this.emit(events.CHANGE_STATE)
	},

	getState(){
		return state
	},


	/**
	*	Grabbing HistoryObj from React-Router
	*/

	setHistoryObject(obj){
		//l('_historyObj : ', obj)
		state._historyObj = obj
	},


	/**
	*	Auth
	*/

	getUserInfo(){
		return state.user
	}

})





export default AppStore