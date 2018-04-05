import React from 'react'
import Delalink from './etc/Delaylink.jsx'
import AppActions from '../flux/actions/AppActions.js'
import AppStore from '../flux/stores/AppStore.js' 
import RegisterStore from '../flux/stores/RegisterStore.js'
import './styles/Register.less'


class Register extends React.Component{
	constructor(props){
		super(props)

		this.state = RegisterStore.getState()

		this._onChangeEvent = this._onChangeEvent.bind(this)
		this._hideContentRegister = this._hideContentRegister.bind(this)
		this._onSubmit = this._onSubmit.bind(this)
		this._delayedCheckUsernameAvailable = this._delayedCheckUsernameAvailable.bind(this)
		this._checkUsernameAvailable = this._checkUsernameAvailable.bind(this)
		this._checkPasswordAvailable = this._checkPasswordAvailable.bind(this)
		this._isFormSucces = this._isFormSucces.bind(this)
	}

	componentWillMount(){
		RegisterStore.addChangeListener(this._onChangeEvent)
		AppStore.addPageChangeListener(this._hideContentRegister)
		AppActions.registerClearFormState()
	}

	componentWillUnmount(){
		RegisterStore.removeChangeListener(this._onChangeEvent)
		AppStore.removePageChangeListener(this._hideContentRegister)
	}

	_onChangeEvent(){
		this.setState(RegisterStore.getState())
	}

	_hideContentRegister(){
		return new Promise( resolve => {
			var i = 0
			var interval = setInterval( () => {
				l('time : ', i++)
			}, 1000)

			setTimeout(() => {
				resolve()
				clearInterval(interval)
			}, 5000)
		})
	}

	_onSubmit(e){
		e.preventDefault()

		if(!this._isFormSucces) return

		var formdata = new FormData(e.target)

		AppActions.register(formdata)
	}

	_delayedCheckUsernameAvailable(e){
		e.persist()
		
		if(this._delayedCheckUsernameAvailable.timer){
			clearTimeout(this._delayedCheckUsernameAvailable.timer)
		}

		this._delayedCheckUsernameAvailable.timer = setTimeout(
			() => {
				this._checkUsernameAvailable(e)
			}, 500
		)
	}

	_checkUsernameAvailable(e){
		var username = e.target.value

		if(username.trim) username = username.trim()
		
		// empty string check
		// no need to check empty string if length must be > 5
		/*if(username == ''){
			AppActions.registerCheckUsernameFail('empty username is not allowed')
			return
		}*/

		// space check
		if(username.split(' ').length > 1){
			AppActions.registerCheckUsernameFail('spaces are not allowed')
			return
		}

		if(username.length < 5 || username.length > 15){
			AppActions.registerCheckUsernameFail('5 < username < 15 : ' + username.length)
			return
		}

		AppActions.registerCheckUsernameAvailable(username)
	}

	_checkPasswordAvailable(e){
		var password = e.target.value

		if(password.length < 5){
			AppActions.registerCheckPasswordFail('password length must be greater than 5 characters')
			return
		}

		AppActions.registerCheckPasswordSuccess()
	}

	_isFormSucces(){
		// TODO : some tests		
		return true
	}

	render(){
		//l(this.state)

		var usernameClassName = 'Register-username '
		if(this.state.usernameAvailable != undefined){
			if(this.state.usernameAvailable) usernameClassName += 'Register-username--available'
			else usernameClassName += 'Register-username--not-available'
		}

		var usernameLoadingClassName = 'Register-username__loading '
		if(this.state.usernameLoading) usernameLoadingClassName += 'Register-username__loading--showed'
		
		var usernameErrorClassName = 'Register-username__error '
		var usernameErrorMessage = ''
		if(this.state.errors.usernameError.error){
			usernameErrorClassName += 'Register-username__error--showed'
			usernameErrorMessage = this.state.errors.usernameError.message
		}


		var passwordLoadingClassName = 'Register-password__loading '
		if(this.state.usernameLoading) passwordLoadingClassName += 'Register-password__loading--showed'
		
		var passwordErrorClassName = 'Register-password__error '
		var passwordErrorMessage = ''
		if(this.state.errors.passwordError.error){
			passwordErrorClassName += 'Register-password__error--showed'
			passwordErrorMessage = this.state.errors.passwordError.message
		}



		return(
			<div>
				<h1>Register</h1>
				<form action="/register" method="post" onSubmit={this._onSubmit}>
					<label className="Register-username__label">
						username : 
						<input 
							type="text" 
							name="username" 
							autoComplete="new-username" 
							required
							/*onInput={this._checkUsernameAvailable*/
							onChange={this._delayedCheckUsernameAvailable}
							className={usernameClassName}/>

						<div className={usernameLoadingClassName}></div>
						<div className={usernameErrorClassName}>{usernameErrorMessage}</div>
					</label>

					<label className="Register-password__label">
						password : 
						<input 
							type="password" 
							name="password" 
							autoComplete="new-password"
							required
							onChange={this._checkPasswordAvailable}
							className="Register-password" />

						<div className={passwordLoadingClassName}></div>
						<div className={passwordErrorClassName}>{passwordErrorMessage}</div>	
					</label>

					<input type="submit" value="register" className="Register-submitBtn" />
				</form>

				<Delalink to="/"> login </Delalink>
			</div>
		)
	}
}

export default Register