import React from 'react'
import Delaylink from './etc/Delaylink.jsx'
import AppActions from '../flux/actions/AppActions.js'
import AppStore from '../flux/stores/AppStore.js'

class Home extends React.Component{
	constructor(props){
		super(props)

		this._hideConentHome = this._hideConentHome.bind(this)
	}

	componentWillMount(){
		AppStore.addPageChangeListener(this._hideConentHome)
	}

	componentWillUnmount(){
		AppStore.removePageChangeListener(this._hideConentHome)
	}

	_hideConentHome(){
		return new Promise(resolve => {
			var i = 0
			var interval = setInterval( () => {
				l('time : ', i++)
			}, 1000)

			setTimeout(() => {
				resolve()
				clearInterval(interval)
			}, 2000)
		})
	}



	render(){
		return(
			<div>
				Home
			</div>
		)
	}
}

export default Home