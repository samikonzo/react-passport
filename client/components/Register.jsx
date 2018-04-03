import React from 'react'

class Register extends React.Component{
	constructor(props){
		super(props)

		this._onSubmit = this._onSubmit.bind(this)
	}

	_onSubmit(e){
		e.preventDefault()

		l(' Register ')
	}

	render(){
		return(
			<div>
				<h1>Register</h1>
				<form action="/register" method="post" onSubmit={this._onSubmit}>
					<label>username : <input type="text" name="username"/></label>
					<label>password : <input type="password" name="password"/></label>
					<input type="submit" value="register"/>
				</form>
			</div>
		)
	}
}

export default Register