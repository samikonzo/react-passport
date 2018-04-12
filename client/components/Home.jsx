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

		l(this.state)

		var username = this.state.user && this.state.user.username

		return(
			<div className='Home'>
				{/*<h1> Hello, {username} </h1>*/}
				{/*<div className='Home_avatar'> </div>*/}
				<Home_avatar avatar={this.user && this.user.avatar}/>
			</div>
		)
	}
}



/*function Home_avatar(props){
	const avatar = props.avatar
	var src = ''
	if(!avatar){
		return <div className='Home_avatar Home_avatar--empty'> </div>
	} else {
		return <div className='Home_avatar'> <img src={avatar}/> </div>
	}
}*/








export default Home