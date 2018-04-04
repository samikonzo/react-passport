import React from 'react'
import AppActions from '../flux/actions/AppActions.js'
import Delaylink from './etc/Delaylink.jsx'

class Login extends React.Component{
	constructor(props){
		super(props)

		this._onSubmit = this._onSubmit.bind(this)
		this._isFormSucces = this._isFormSucces.bind(this)
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
		return(
			<div>
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