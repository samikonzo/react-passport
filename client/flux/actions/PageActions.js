import Dispatcher from '../dispatcher/AppDispatcher.js'
import Constants from '../constants/AppConstants.js'
import api from '../api/api.js'

export default {
	pageSetHistoryObj(obj){
		Dispatcher.dispatch({
			type: Constants.PAGE_SET_HISTORY_OBJECT,
			data: obj,
			object: obj,
			obj: obj,
		})

		setTimeout(function f(){
			var dispatching = Dispatcher.isDispatching()
			//l('dispatching : ', dispatching)
			if(dispatching){
				setTimeout(f, 1000)
			}

		}, 0)
	},

	pagePopstate(e){
		/*Dispatcher.dispatch({
			type : Constants.POP_STATE
		})*/
	},

	pageRedirectTo(url){
		Dispatcher.dispatch({
			type: Constants.PAGE_REDIRECT_TO,
			data: url,
			url : url,
			href : url,
		})
	},
}