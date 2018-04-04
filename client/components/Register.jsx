import React from 'react'
import Delalink from './etc/Delaylink.jsx'
import AppActions from '../flux/actions/AppActions.js'
import RegisterStore from '../flux/stores/RegisterStore.js'


class Register extends React.Component{
	constructor(props){
		super(props)

		this.state = RegisterStore.getState()

		this._onChangeEvent = this._onChangeEvent.bind(this)
		this._onSubmit = this._onSubmit.bind(this)
		this._checkUsernameAvailable = this._checkUsernameAvailable.bind(this)
		this._isFormSucces = this._isFormSucces.bind(this)
	}

	componentWillMount(){
		RegisterStore.addChangeListener(this._onChangeEvent)
	}
	componentWillUnmount(){
		RegisterStore.removeChangeListener(this._onChangeEvent)
	}

	_onChangeEvent(){
		this.setState(RegisterStore.getState())
	}


	_onSubmit(e){
		e.preventDefault()

		if(!this._isFormSucces) return

		var formdata = new FormData(e.target)

		AppActions.register(formdata)
	}

	_checkUsernameAvailable(e){
		// TODO : AppActions.checkAvailable...
		//l(e.target.value)
	}

	_isFormSucces(){
		// TODO : some tests		
		return true
	}

	render(){
		l(this.state)

		var usernameClassName = 'username '
		if(this.state.usernameAvailable != undefined){
			if(this.state.usernameAvailable) usernameClassName += 'username--available'
			else usernameClassName += 'username--not-available'
		}

		var loadingClassName = 'username__loading '
		if(this.state.usernameLoading) loadingClassName += 'username__loading--showed'


		return(
			<div>
				<h1>Register</h1>
				<form action="/register" method="post" onSubmit={this._onSubmit}>
					<label>
						username : 
						<input 
							type="text" 
							name="username" 
							autoComplete="new-username" 
							onInput={this._checkUsernameAvailable}
							className={usernameClassName}/>

						<div className={loadingClassName}></div>
					</label>
					<label>password : <input type="password" name="password" autoComplete="new-password"/></label>
					<input type="submit" value="register"/>
				</form>

				<Delalink to="/"> login </Delalink>
			</div>
		)
	}
}

export default Register