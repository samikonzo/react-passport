import React from 'react'
import { Link, Route, Switch, Redirect } from 'react-router-dom'
import AppActions from '../flux/actions/AppActions.js'
import AppStore from '../flux/stores/AppStore.js'
import AuthStore from '../flux/stores/AuthStore.js'

import './App.less'

// Components
import Login from '../components/Login.jsx'
import LogoutBtn from '../components/LogoutBtn.jsx'
import Register from '../components/Register.jsx'
import Home from '../components/Home.jsx'
import PageLoading from '../components/PageLoading.jsx' //loading for authcheck
import Loading from '../components/etc/Loading.jsx'
import Menu from '../components/Menu.jsx'
import Items from '../components/Items.jsx'

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
		this._waitingSetState_App = this._waitingSetState_App.bind(this)
		this._fromWaitingToState_App = this._fromWaitingToState_App.bind(this)
		this._onChangeEvent_App = this._onChangeEvent_App.bind(this)
		this._checkAuthEveryTime = this._checkAuthEveryTime.bind(this)
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
		// set state, then check waitingStates
		this.setState(AppStore.getState(), this._fromWaitingToState_App)
	}

	_onPageChangePrepare_App(){}

	_onPageChange_App(){}

	_onAuthChange_App(){
		var AuthState = AuthStore.getState()

		if(AuthState.Auth_isLogged) this._checkAuthEveryTime()

		var needToGetuserInfo = (AuthState.Auth_isLogged && 
								!AuthState.Auth_user && 
								!AuthState.Auth_userIsLoading)

		if(needToGetuserInfo){
			AppActions.authGetUserInfo()
		}

		if(this.state.App_isLoading){
			this._waitingSetState_App( AuthState )
		} else {
			this.setState( AuthState )
		}
	}

	_waitingSetState_App(state){
		// dont want to render, thats why using state but not setState
		if(!this.state.waiting){
			this.state.waiting = []
		}

		this.state.waiting.push(state)
	}

	_fromWaitingToState_App(){
		if(!this.state.loading){
			var states = {}

			//l('_fromWaitingToState_App', this.state.waiting)

			if(this.state.waiting){
				this.state.waiting.forEach( stateObj => {
					states = Object.assign(states, stateObj)
				})
			}

			delete this.state.waiting 

			this.setState(states)
		}
	}

	_checkAuthEveryTime(){
		const CHECK_TIME =  60 * 1000 // check every minute in ms

		if(this._checkAuthEveryTime.timer) return

		var that = this			

		this._checkAuthEveryTime.timer = setTimeout( function f(){
			AppActions.authCheckAuthSilent()

			if(that.state.Auth_isLogged){
				that._checkAuthEveryTime.timer = setTimeout(f, CHECK_TIME)
			} else {
				delete that._checkAuthEveryTime.timer
			}
		}, CHECK_TIME)
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
				<div className='AppBody'>
					<Menu />
					{/*<LogoutBtn />*/}
					
					<Switch> 
						<Route exact path='/' component={Home} />
						<Route path='/contacts' component={Contacts} />
						<Route path='/items' component={Items} />
						<Redirect path='/register' to={{pathname: '/'}} />
						<Route component={PageLoading}/>
						{/*<Redirect to={{pathname: '/'}}/>*/}
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
			GrabberLink = (<div className="here_was_GrabberLink"></div>)
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