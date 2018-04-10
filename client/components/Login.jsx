import React from 'react'
import AppActions from '../flux/actions/AppActions.js'
import AppStore from '../flux/stores/AppStore.js'
import AuthStore from '../flux/stores/AuthStore.js'
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
		this._onPageChangePrepare_Login = this._onPageChangePrepare_Login.bind(this)
		this._onAuthChange_Login = this._onAuthChange_Login.bind(this)
		this._hideContent_Login = this._hideContent_Login.bind(this)
		this._showContent_Login = this._showContent_Login.bind(this)
	}


	componentWillMount(){
	}

	componentDidMount(){
		AppStore.addPageChangeListener(this._onPageChangePrepare_Login)
		AuthStore.addChangeListener(this._onAuthChange_Login)

		this.state._showContentTimer = setTimeout( () => { 
			this._showContent_Login()
		}, 100)
	}

	componentWillUnmount(){
		AppStore.removePageChangeListener(this._onPageChangePrepare_Login)
		AuthStore.removeChangeListener(this._onAuthChange_Login)

		// warning fix
		clearTimeout(this.state._showContentTimer)
	}

	_onPageChangePrepare_Login(){
		return this._hideContent_Login()
	}

	_onAuthChange_Login(){}

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
		AppActions.authLogin(formdata)
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
					<label className="Login_username__label">
						username : <input type="text" name="username" className="Login_username"/>
					</label>

					<label className="Login_password__label">
						password : <input type="password" name="password" className="Login_password"/>
					</label>

					<input type="submit" value="login" className="Login-submitBtn"/>
				</form>

				<Delaylink to="/register"> register </Delaylink>
			</div>
		)
	}
}

export default Login