import React from 'react'
import Delalink from './etc/Delaylink.jsx'

class Login extends React.Component{
	constructor(props){
		super(props)

		this._onSubmit = this._onSubmit.bind(this)
	}

	_onSubmit(e){
		e.preventDefault()

		l(' Login ')
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

				<Delalink to="/register"> register </Delalink>
			</div>
		)
	}
}

export default Login