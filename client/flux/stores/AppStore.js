import Dispatcher from '../dispatcher/AppDispatcher.js'
import Constants from '../constants/AppConstants.js'
import AppActions from '../actions/AppActions.js'
import { EventEmitter } from 'events'


const events = {
	'CHANGE_STATE' : 'CHANGE_STATE',
	'PAGE_PRE_CHANGE' : 'PAGE_PRE_CHANGE' ,
	'PAGE_CHANGE' : 'PAGE_CHANGE' ,
}


const state = {
	isLoading: false,
	isLogged: false,
	_historyObj: undefined,
	error : false,
	message : undefined,
}



Dispatcher.register( function(action){
	switch(action.type){

		case Constants.CHECK_AUTH_STARTED : {
			l(' CHECK_AUTH_STARTED ')
			state.isLoading = true
			AppStore.emitChange()
			break;
		}

		case Constants.CHECK_AUTH_SUCCESS : {
			l(' CHECK_AUTH_SUCCESS ')
			var result = action.data

			if(result) state.isLogged = true
			else state.isLogged = false

			state.isLoading = false

			AppStore.emitChange()
			break;
		}

		case Constants.CHECK_AUTH_FAIL : {
			l(' CHECK_AUTH_FAIL ')
			var err = action.error
			l(err)

			state.isLoading = false

			AppStore.emitChange()
			break;
		}

		case Constants.SET_HISTORY_OBJECT : {
			AppStore.setHistoryObject(action.data)
			break;
		}

		case Constants.REDIRECT_TO : {
			AppStore.emitPagePreChange()
				.then(() => {
					AppStore.redirectTo(action.url)
					AppStore.emitPageChange()
				})
			break;
		}

		case Constants.LOGOUT : {
			l(' LOGOUT ')
			state.isLogged = false
			//AppStore.emitChange()
			break;
		}

		case Constants.LOGIN_TRY : {
			l(' LOGIN_TRY ')
			state.isLoading = true
			AppStore.emitChange()
			break;
		}

		case Constants.LOGIN_SUCCESS : {
			l(' LOGIN_SUCCESS ')
			// TODO : smooth reload page through PageChange

			AppStore.emitPagePreChange()
				.then(() => {
					state.isLoading = false

					var result = action.data

					if(result){
						state.isLogged = true
						state.error = false
						state.message = undefined
					} else {
						// mb dont need
						state.isLogged = false
					}

					AppStore.emitChange()
				})

			break;
		}

		case Constants.LOGIN_FAIL : {
			l(' LOGIN_FAIL ')
			state.isLoading = false
			state.error = true
			state.message = 'wrong pair login / password'

			AppStore.emitChange()
			break;
		}

		case Constants.AFTER_REGISTRATION_LOGIN : {
			l(' AFTER_REGISTRATION_LOGIN ')
			state.isLogged = true;

			l(state)
			//AppStore.emitChange()
			break;
		}



	}
})	


const AppStore = Object.assign({}, EventEmitter.prototype, {

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
							l('+1 resolved')
							promisesReady++

							if(checkAllReady){
								l('all ready')
								resolve()
							}
						}
					)
				}
			})

			function checkAllReady(){
				l('promisesReady : ', promisesReady)
				l('promisesFuncs :', promisesFuncs)
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

	emitChange(){
		l(' STORE : EMIT CHANGE')
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
})


export default AppStore