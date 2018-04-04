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
}



Dispatcher.register( function(action){
	switch(action.type){

		case Constants.CHECK_AUTH_STARTED : {
			state.isLoading = true
			AppStore.emitChange()
			break;
		}

		case Constants.CHECK_AUTH_SUCCESS : {
			var result = action.data

			if(result) state.isLogged = true
			else state.isLogged = false

			state.isLoading = false

			AppStore.emitChange()
			break;
		}

		case Constants.CHECK_AUTH_FAIL : {
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
			AppStore.redirectTo(action.url)
			break;
		}

		case Constants.LOGOUT : {
			state.isLogged = false
			AppStore.emitChange()
			break;
		}

		case Constants.LOGIN_TRY : {
			state.isLoading = true
			AppStore.emitChange()
			break;
		}

		case Constants.LOGIN_RESULT : {
			// TODO : smooth reload page through PageChange

			state.isLoading = false

			var result = action.data

			if(result) state.isLogged = true
			else state.isLogged = false

			AppStore.emitChange()
			break;
		}

		case Constants.AFTER_REGISTRATION_LOGIN : {
			state.isLogged = true;
			AppStore.emitChange()
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
			var originalFuncs = []
			var promiseFuncs = []
			var promisesReady = 0


			// distribution of functions
			listenersFuncs.forEach(f => {
				if(f.type != undefined){
					if(f.type == 'promise') promiseFuncs.push(f)
					else originalFuncs.push(f)	

					return
				}

				if(isPromise(f)){
					f.type = 'promise'
					promiseFuncs.push(f)
				} else {
					f.type = 'function'
					originalFuncs.push(f)
				}
			})

			// run all original funcs
			originalFuncs.forEach(f => {
				f()
			})

			//run all promise func
			promiseFuncs.forEach(f => {
				f().then(
					fReady => {
						promisesReady++

						if(checkAllReady){
							resolve()
						}
					}
				)
			})

			function checkAllReady(){
				return promisesReady == promiseFuncs.length
			}
		})
	},

	emitPageChange(){
		// TODO : add history push
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
		l('_historyObj : ', obj)
		state._historyObj = obj
	},
})


export default AppStore