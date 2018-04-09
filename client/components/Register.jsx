import React from 'react'
import Delalink from './etc/Delaylink.jsx'
import AppActions from '../flux/actions/AppActions.js'
import AppStore from '../flux/stores/AppStore.js' 
import RegisterStore from '../flux/stores/RegisterStore.js'
import './styles/Register.less'


class Register extends React.Component{
	constructor(props){
		super(props)

		this.state = Object.assign({
			hidden: true
		}, RegisterStore.getState())

		this._onChangeEvent = this._onChangeEvent.bind(this)
		this._onSubmit = this._onSubmit.bind(this)
		this._delayedCheckUsernameAvailable = this._delayedCheckUsernameAvailable.bind(this)
		this._checkUsernameAvailable = this._checkUsernameAvailable.bind(this)
		this._checkPasswordAvailable = this._checkPasswordAvailable.bind(this)
		this._isFormSucces = this._isFormSucces.bind(this)
		this._hideContent_Register = this._hideContent_Register.bind(this)
		this._showContent_Register = this._showContent_Register.bind(this)
	}

	componentWillMount(){
		RegisterStore.addChangeListener(this._onChangeEvent)
		AppStore.addPageChangeListener(this._hideContent_Register)
		AppActions.registerClearFormState()
	}

	componentDidMount(){
		setTimeout( () => { 
			this._showContent_Register()
		}, 100)
	}

	componentWillUnmount(){
		RegisterStore.removeChangeListener(this._onChangeEvent)
		AppStore.removePageChangeListener(this._hideContent_Register)
	}

	_onChangeEvent(){
		this.setState(RegisterStore.getState())
	}


	_showContent_Register(){
		this.setState({
			hidden : false
		})
	}

	_hideContent_Register(){
		return new Promise( resolve => {
			this.setState({
				hidden: true,
			})

			setTimeout(() => {
				resolve()
			}, 500)
		})
	}

	_onSubmit(e){
		e.preventDefault()

		if(this.state.waiting) return
		if(this.state.registred) return
		if(!this._isFormSucces()) return

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
		
		// space check
		if(username.split(' ').length > 1){
			AppActions.registerCheckUsernameFail('spaces are not allowed')
			return
		}

		// length check
		if(username.length < 5 || username.length > 15){
			AppActions.registerCheckUsernameFail('5 < username < 15 : ' + username.length)
			return
		}

		// everything ok -> send to server for check availability
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
		if(!this.state.usernameAvailable || !this.state.passwordAvailable) return false

		return true
	}

	render(){

		//l(this.state)

		// wrapper
		var wrapperClassName = 'Register_wrapper '
		if(this.state.hidden) wrapperClassName += 'Register_wrapper--hidden'


		// username
		var usernameClassName = 'Register_username '
		if(this.state.usernameAvailable != undefined){
			if(this.state.usernameAvailable) usernameClassName += 'Register_username--available'
			else usernameClassName += 'Register_username--not-available'
		}

		
		var usernameErrorClassName = 'Register_username__error '
		var usernameErrorMessage = ''
		if(this.state.errors.usernameError.error){
			usernameErrorClassName += 'Register_username__error--showed'
			usernameErrorMessage = this.state.errors.usernameError.message
		}


		// password
		var passwordClassName = 'Register_password '
		if(this.state.passwordAvailable != undefined){
			if(this.state.passwordAvailable) passwordClassName += 'Register_password--available'
			else passwordClassName += 'Register_password--not-available'
		}	
		
		var passwordErrorClassName = 'Register_password__error '
		var passwordErrorMessage = ''
		if(this.state.errors.passwordError.error){
			passwordErrorClassName += 'Register_password__error--showed'
			passwordErrorMessage = this.state.errors.passwordError.message
		}


		// loading 
		var Register_loadingClassName = 'Register_loading '
		if(this.state.usernameLoading) Register_loadingClassName += 'Register_loading--showed'
		

		return(
			<div className={wrapperClassName}>
				<h1>Register</h1>
				<form action="/register" method="post" onSubmit={this._onSubmit}>
					<label className="Register_username__label">
						username : 
						<input 
							type="text" 
							name="username" 
							autoComplete="new-username" 
							required
							/*onInput={this._checkUsernameAvailable*/
							onChange={this._delayedCheckUsernameAvailable}
							className={usernameClassName}/>

						
						<div className={usernameErrorClassName}>{usernameErrorMessage}</div>
					</label>

					<label className="Register_password__label">
						password : 
						<input 
							type="password" 
							name="password" 
							autoComplete="new-password"
							required
							onChange={this._checkPasswordAvailable}
							className={passwordClassName} />

						{/*<div className={passwordLoadingClassName}></div>*/}
						<div className={passwordErrorClassName}>{passwordErrorMessage}</div>	
					</label>

					<input type="submit" value="register" className="Register-submitBtn" />


				</form>

				<Delalink to="/"> login </Delalink>
				
				<div className={Register_loadingClassName}></div>
			</div>
		)
	}
}

export default Register