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

class App extends React.Component{
	constructor(props){
		super(props)

		this.state = Object.assign({}, 
			AppStore.getState(),
			AuthStore.getState(),
		)
	

		this._historyObjGrabber = this._historyObjGrabber.bind(this)
		/*this._onChangeEvent_App = this._onChangeEvent_App.bind(this)
		this._onPageChangePreaparingApp = this._onPageChangePreaparingApp.bind(this)
		this._onPageChangeApp = this._onPageChangeApp.bind(this)
		*/
	}

	componentWillMount(){
		/*AppStore.addChangeListener(this._onChangeEvent_App)
		AppStore.addPageChangeListener(this._onPageChangePreaparingApp, this._onPageChangeApp)
		AppActions.checkAuth()*/


		/*window.addEventListener('popstate', e => {
			e.preventDefault()
			AppActions.popstate()
		})*/
	}

	componentWillUnmount(){
		/*AppStore.removeChangeListener(this._onChangeEvent_App)
		AppStore.removePageChangeListener(this._onPageChangePreaparingApp, this._onPageChangeApp)*/
	}

	componentWillReceiveProps(nextProps){
		//l('nextProps')
	}

	_onChangeEvent_App(){
		//l('_onChangeEvent_App')
		//l('_onChangeEvent_App : ', AppStore.getState())
		/*this.setState(AppStore.getState(), () => {
			if(this.state.isLogged && 
			 	!this.state.isLoading &&
			 	 !this.state.user){
				AppActions.getUserInfo()
			}
		})*/

	}

	_onPageChangePreaparingApp(){}

	_onPageChangeApp(){
		//l('_onPageChangeApp')
		/*this.setState(AppStore.getState(),() => {
			l(this.state)
		})*/
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

		l(this.state)

		var AppBody
		if(this.state.isLogged){
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

		// Grabber Link needs for grab historyObj from Link
		var GrabberLink
		if(this.state._historyObj == undefined){
			GrabberLink = (<Link to='/' ref={elem => {this._historyObjGrabber(elem)}}/>)
		} else {
			GrabberLink = (<div></div>)
		}


		return (
			<div> 
				{AppBody}
				{GrabberLink}
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