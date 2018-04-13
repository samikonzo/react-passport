import React from 'react'
import Delaylink from './etc/Delaylink.jsx'
import AppActions from '../flux/actions/AppActions.js'
import AppStore from '../flux/stores/AppStore.js'
import AuthStore from '../flux/stores/AuthStore.js'

// components
import Home_avatar from './Home_avatar.jsx'



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
			setTimeout(() => {
				resolve()
			}, 1000)
		})
	}

	_onAuthChange_Home(){
		//l('_onAuthChange_Home!')

		var AuthState = AuthStore.getState()
		if(!AuthState || !AuthState.Auth_isLogged){
			return
		}

		var user = AuthState.Auth_user

		this.setState({
			user : user
		})
	}



	render(){

		//l(this.state)

		return(
			<div className='Home'>
				<Home_avatar avatar={this.state.user && this.state.user.avatar}/>
			</div>
		)
	}
}







export default Home