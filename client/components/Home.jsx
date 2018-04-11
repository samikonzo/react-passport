import React from 'react'
import Delaylink from './etc/Delaylink.jsx'
import AppActions from '../flux/actions/AppActions.js'
import AppStore from '../flux/stores/AppStore.js'
import AuthStore from '../flux/stores/AuthStore.js'

class Home extends React.Component{
	constructor(props){
		super(props)

		this.state = {
			user : AuthStore.getUserInfo()	
		}

		this._hideConent_Home = this._hideConent_Home.bind(this)
		this._onAuthChange_Home = this._onAuthChange_Home.bind(this)
	}

	componentWillMount(){
		AppStore.addPageChangeListener(this._hideConent_Home)
		AuthStore.addChangeListener(this._onAuthChange_Home)
	}

	
	componentWillUnmount(){
		AppStore.removePageChangeListener(this._hideConent_Home)
		AuthStore.removeChangeListener(this._onAuthChange_Home)
	}

	_hideConent_Home(){
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

	_onAuthChange_Home(){
		var AuthState = AuthStore.getState()
		if(!AuthState || !AuthState.Auth_isLogged){
			return
		}

		var user = AuthState.Auth_user

		this.setState({
			user : user
		})

		/*var AuthState = AuthStore.getUserInfo()
		if(!AuthState || !AuthState.Auth_isLogged){
			l(AuthState)
			l(!AuthState.Auth_isLogged)
			return
		}

		this.setState({
			user: AuthState
		})*/
	}



	render(){

		l(this.state)

		var username = this.state.user && this.state.user.username

		return(
			<div>
				<h1> Hello, {username} </h1>

				<Delaylink to="/contacts">Contacts</Delaylink>
			</div>
		)
	}
}

export default Home