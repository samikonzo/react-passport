import React from 'react'
import Delaylink from './etc/Delaylink.jsx'
import AppActions from '../flux/actions/AppActions.js'
import AppStore from '../flux/stores/AppStore.js'

class Home extends React.Component{
	constructor(props){
		super(props)

		this.state = {
			//user : AppStore.getUserInfo()	
		}

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
			/*var i = 0
			var interval = setInterval( () => {
				l('time : ', i++)
			}, 1000)*/

			setTimeout(() => {
				resolve()
				//clearInterval(interval)
			}, 1000)
		})
	}



	render(){

		l(this.state)

		return(
			<div>
				Hello, {}

				<Delaylink to="/contacts">Contacts</Delaylink>
			</div>
		)
	}
}

export default Home