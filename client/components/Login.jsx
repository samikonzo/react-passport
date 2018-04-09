import React from 'react'
import AppActions from '../flux/actions/AppActions.js'
import AppStore from '../flux/stores/AppStore.js'
import Delaylink from './etc/Delaylink.jsx'

import './styles/Login.less'

class Login extends React.Component{
	constructor(props){
		super(props)

		this.state = {
			hidden : true,
		}

		this._onSubmit = this._onSubmit.bind(this)
		this._isFormSucces = this._isFormSucces.bind(this)
		this._hideContent_Login = this._hideContent_Login.bind(this)
		this._showContent_Login = this._showContent_Login.bind(this)
	}


	componentWillMount(){
		//AppActions.checkAuth()
		AppStore.addPageChangeListener(this._hideContent_Login)
	}

	componentDidMount(){
		setTimeout( () => { 
			this._showContent_Login()
		}, 100)
	}

	componentWillUnmount(){
		AppStore.removePageChangeListener(this._hideContent_Login)
	}

	_showContent_Login(){
		this.setState({
			hidden : false
		})
	}

	_hideContent_Login(){
		return new Promise(resolve => {
			/*var i = 0
			var interval = setInterval( () => {
				l('time : ', i++)
			}, 1000)*/
			this.setState({
				hidden: true
			})

			setTimeout(() => {
				resolve()
				//clearInterval(interval)
			}, 500)
		})
	}


	_onSubmit(e){
		e.preventDefault()

		if(!this._isFormSucces) return

		var formdata = new FormData(e.target)
		AppActions.login(formdata)
	}

	_isFormSucces(){
		return true
	}

	render(){

		var wrapperClassName = 'Login_wrapper '
		if(this.state.hidden) wrapperClassName += 'Login_wrapper--hidden'

		return(
			<div className={wrapperClassName}>
				<h1>Login Page </h1>
				<form action="/login" method="post" onSubmit={this._onSubmit}>
					<label>username : <input type="text" name="username"/></label>
					<label>password : <input type="password" name="password"/></label>
					<input type="submit" value="login"/>
				</form>

				<Delaylink to="/register"> register </Delaylink>
			</div>
		)
	}
}

export default Login