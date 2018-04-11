import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import AppActions from '../flux/actions/AppActions.js'
import AppStore from '../flux/stores/AppStore.js'
import AuthStore from '../flux/stores/AuthStore.js'

import './App.less'

// Components
import Login from '../components/Login.jsx'
import LogoutBtn from '../components/LogoutBtn.jsx'
import Register from '../components/Register.jsx'
import Home from '../components/Home.jsx'
import PageLoading from '../components/PageLoading.jsx'
import Loading from '../components/etc/Loading.jsx'



/**
*	Description
*	not trivial system of state changing
*	if main page is buzy (App_isLoading == true)
*	then other stores-stateSender waiting in the this.state.waiting
*	and only after App_isLoading == false new states used
*/
//function l(){}


class App extends React.Component{
	constructor(props){
		super(props)

		this.state = Object.assign({}, 
			AppStore.getState(),
			AuthStore.getState(),
		)
	
		this._historyObjGrabber = this._historyObjGrabber.bind(this)
		this._onPageChangePrepare_App = this._onPageChangePrepare_App.bind(this)
		this._onPageChange_App = this._onPageChange_App.bind(this)
		this._onAuthChange_App = this._onAuthChange_App.bind(this)
		this._waitingAdd_App = this._waitingAdd_App.bind(this)
		this._waitingToState_App = this._waitingToState_App.bind(this)
		this._onChangeEvent_App = this._onChangeEvent_App.bind(this)
	}

	componentWillMount(){
		AppStore.addChangeListener(this._onChangeEvent_App)
		AppStore.addPageChangeListener(this._onPageChangePrepare_App, this._onPageChange_App)
		AuthStore.addChangeListener(this._onAuthChange_App)
		
		AppActions.authCheckAuth()
	}

	componentWillUnmount(){
		AppStore.removeChangeListener(this._onChangeEvent_App)
		AppStore.removePageChangeListener(this._onPageChangePrepare_App, this._onPageChange_App)
		AuthStore.removeChangeListener(this._onAuthChange_App)
	}

	componentWillReceiveProps(nextProps){
		//l('nextProps')
	}

	_onChangeEvent_App(){
		this.setState(AppStore.getState(),this._waitingToState_App)
	}

	_onPageChangePrepare_App(){
	}

	_onPageChange_App(){
	}

	_onAuthChange_App(){
		var AuthState = AuthStore.getState()

		var needToGetuserInfo = (AuthState.Auth_isLogged && 
								!AuthState.Auth_user && 
								!AuthState.Auth_userIsLoading)

		if(needToGetuserInfo){
			AppActions.authGetUserInfo()
		}

		if(this.state.App_isLoading){
			this._waitingAdd_App( AuthState )
		} else {
			this.setState( AuthState )
		}
	}

	_waitingAdd_App(state){
		// dont want to render, thats why using state but not setState
		if(!this.state.waiting){
			this.state.waiting = []
		}

		this.state.waiting.push(state)
	}

	_waitingToState_App(){
		if(!this.state.loading){
			var states = {}

			//l('_waitingToState_App', this.state.waiting)

			if(this.state.waiting){
				this.state.waiting.forEach( stateObj => {
					states = Object.assign(states, stateObj)
				})
			}

			delete this.state.waiting 

			this.setState(states)
		}
	}

	_historyObjGrabber(elem){
		if(this.state._historyObj) return
		
		if(elem && elem.context && elem.context.router && elem.context.router.history){
			var _historyObj = elem.context.router.history
			AppActions.pageSetHistoryObj(_historyObj)
		}

		return
	}

	render(){

		//l(this.state)

		var AppBody
		if(this.state.Auth_isLogged){
			AppBody = (	
				<div>
					<LogoutBtn />
					
					<Switch> 
						<Route exact path='/' component={Home} />
						<Route path='/contacts' component={Contacts} />
					</Switch>
				</div>
			)
		} else {
			AppBody = (
				<Switch> 
					<Route path='/register' component={Register} />
					<Route path='*' component={Login} />
				</Switch> 
			)
		}

		// try auth_isloading => must broke system
		// then try new flag, that meaning that first check was make
		if(this.state.Auth_isLoading && !this.state.Auth_firstCheck){
			AppBody = (
				<PageLoading/>
			)
		}



		// Grabber Link needs for grab historyObj from Link
		var GrabberLink
		if(this.state._historyObj == undefined){
			GrabberLink = (<Link to='/' ref={elem => {this._historyObjGrabber(elem)}}/>)
		} else {
			GrabberLink = (<div></div>)
		}


		return (
			<div> 
				{GrabberLink}
				{AppBody}
				<Loading showed={this.state.App_isLoading || this.state.Auth_isLoading}/>
			</div>
		)
	}
}




const Contacts = () => {
	return(
		<div>Contacts</div>
	)
}


export default App