import Dispatcher from '../dispatcher/AppDispatcher.js'
import Constants from '../constants/AppConstants.js'
import api from '../api/api.js'

import RegisterActions from './RegisterActions.js'
import AuthActions from './AuthActions.js'
import UserActions from './UserActions.js'
import PageActions from './PageActions.js'

const l = console.log;

var AppActions ={}

AppActions = Object.assign(AppActions, RegisterActions, AuthActions, UserActions, PageActions)


/**
*	Dispatchers multiRequest issue fix
* 	by creating queue of requests
*/

function dispatchingCheck(fName, args){
	/**
	*	check Dispatcher.isDispatching
		if Dispather not buzy return false 
		else 
			return true (and prevent original func) 
			create queue (if not exist)
			add
	*/

	if(Dispatcher.isDispatching()){

		if(!Dispatcher._queue) Dispatcher._queue = []
		Dispatcher._queue.push({
			fName: fName,
			arguments: args,
		})	


		if(!Dispatcher._queueTimer){
			Dispatcher._queueTimer = setTimeout( function f(){

				if(Dispatcher.isDispatching()){
					Dispatcher._queueTimer = setTimeout( f, 100 )
				} else {

					if(Dispatcher._queue){

						// wrong method, cuz delayedF must get first _queue object
						// var delayedF = Dispatcher._queue.pop()
						var delayedF = Dispatcher._queue.splice(0,1)[0]
						
						//l('AppActions : ', fName)

						AppActions[delayedF.fName].apply(null, delayedF.arguments)
						if(!Dispatcher._queue.length){
							delete Dispatcher._queue
							delete Dispatcher._queueTimer	
						} else {
							Dispatcher._queueTimer = setTimeout( f, 100 )
						}
					}

				}

			}, 100)	
		} 

		return true
	} else {
		return false
	}
}

for(let fName in AppActions){
	let savedF = AppActions[fName]

	AppActions[fName] = function(){
		if(dispatchingCheck(fName, arguments))	return
	
		//l('AppActions -', fName, ' : ', arguments)
		savedF.apply(null, arguments)
	}
}

//////////////////////////////////////



export default AppActions