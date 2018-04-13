import Dispatcher from '../dispatcher/AppDispatcher.js'
import Constants from '../constants/AppConstants.js'
import { EventEmitter } from 'events'


const events = {
	'STATE_CHANGE' : 'STATE_CHANGE',
	'PAGE_CHANGE_PREPARE' : 'PAGE_CHANGE_PREPARE' ,
	'PAGE_CHANGE' : 'PAGE_CHANGE' ,
}


const state = {
	App_isLoading: false,
	_historyObj: undefined,
}

Dispatcher.register( function(action){
	switch(action.type){

		case Constants.PAGE_SET_HISTORY_OBJECT : {
			AppStore.setHistoryObject(action.data)
			AppStore.emitChange()
			break;
		}

		case Constants.PAGE_REDIRECT_TO : {
			//l(' REDIRECT_TO ')
			state.App_isLoading = true
			AppStore.emitChange()

			AppStore.emitPageChangePrepare()
				.then(() => {
					state.App_isLoading = false		
					AppStore.redirectTo(action.url)
					AppStore.emitPageChange()
					AppStore.emitChange()
				})
			break;
		}
	}
})	


const AppStore = Object.assign({}, EventEmitter.prototype, {

	//Grabbing HistoryObj from React-Router
	setHistoryObject(obj){
		//l('_historyObj : ', obj)
		state._historyObj = obj
	},


	/**
	*	Page Changing
	*	1) run all pagePreaparing promise funcs
	*	2) after resolve of pagePrepare promise run page change
	*/

	addPageChangeListener(pagePreaparing, pageChange){
		this.on(events.PAGE_CHANGE_PREPARE, pagePreaparing)
		if(pageChange != undefined) this.on(events.PAGE_CHANGE, pageChange)
	},

	removePageChangeListener(pagePreaparing, pageChange){
		this.removeListener(events.PAGE_CHANGE_PREPARE, pagePreaparing)
		if(pageChange != undefined) this.removeListener(events.PAGE_CHANGE, pageChange)
	},

	emitPageChangePrepare(){
		return new Promise( (resolve, reject) => {
			var listenersFuncs = this.listeners(events.PAGE_CHANGE_PREPARE)
			var promisesFuncs = 0
			var promisesReady = 0

			//l(listenersFuncs)

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
		//l('AppStore redirectTo : ', url)
		state._historyObj.push(url)
	},


	/**
	*	State Change
	*/

	addChangeListener(f){
		this.on(events.STATE_CHANGE, f)
	},

	removeChangeListener(f){
		this.removeListener(events.STATE_CHANGE, f)
	},	

	emitChange(){
		this.emit(events.STATE_CHANGE)
	},
	
	getState(){
		return state
	},
})


export default AppStore