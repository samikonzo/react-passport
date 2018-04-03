import Dispatcher from '../dispatcher/AppDispatcher.js'
import Constants from '../constants/AppConstants.js'
import { EventEmitter } from 'events'


const Events = {
	'CHANGE_STATE' : 'CHANGE_STATE',
	'PAGE_PRE_CHANGE' : 'PAGE_PRE_CHANGE' ,
	'PAGE_CHANGE' : 'PAGE_CHANGE' ,
}


const State = {
	isLoading: false,
	isLogged: false,
}







Dispatcher.register( function(action){
	switch(action.type){

		// login
		/*case Constants.CHECK_LOGIN : {
			State.loading = true
			AppStore.emitChange()
			break;
		}*/

	}
})	


const AppStore = Object.assign({}, EventEmitter.prototype, {

	/**
	*	Page Changing
	*	1) run all pagePreaparing promise funcs
	*	2) after resolve of pagePrepare promise run page change
	*/

	addPageChangeListener(pagePreaparing, pageChange){
		this.on(Events.PAGE_PRE_CHANGE, pagePreaparing)
		if(pageChange != undefined) this.on(Events.PAGE_CHANGE, pageChange)
	},

	removePageChangeListener(pagePreaparing, pageChange){
		this.removeListener(Events.PAGE_PRE_CHANGE, pagePreaparing)
		if(pageChange != undefined) this.removeListener(Events.PAGE_CHANGE, pageChange)
	},

	emitPagePreChange(){
		return new Promise( (resolve, reject) => {
			var listenersFuncs = this.listeners(Events.PAGE_PRE_CHANGE)
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
		this.emit(Events.PAGE_CHANGE)
	},


	/**
	*	State Changing
	*/

	addChangeListener(f){
		this.on(Events.CHANGE_STATE, f)
	},

	removeChangeListener(f){
		this.removeListener(Events.CHANGE_STATE, f)
	},

	emitChange(){
		this.emit(Events.CHANGE_STATE)
	},

	getState(){
		return State
	}
})


export default AppStore