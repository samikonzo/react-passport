import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import AppActions from '../flux/actions/AppActions.js'
import AppStore from '../flux/stores/AppStore.js'

// Components
import Login from '../components/Login.jsx'
import LogoutBtn from '../components/LogoutBtn.jsx'
import Register from '../components/Register.jsx'
import Home from '../components/Home.jsx'

class App extends React.Component{
	constructor(props){
		super(props)

		this.state = AppStore.getState()/* {
			//isLoading: false,
			//isLogged : false,
			//hasHistoryObj : AppStore.hasHistoryObj()
		}*/

		this._onChangeEvent = this._onChangeEvent.bind(this)
		this._onPageChangePreaparingApp = this._onPageChangePreaparingApp.bind(this)
		this._onPageChange = this._onPageChange.bind(this)
		this._historyObjGrabber = this._historyObjGrabber.bind(this)
	}

	componentWillMount(){
		AppStore.addChangeListener(this._onChangeEvent)
		AppStore.addPageChangeListener(this._onPageChangePreaparingApp, this._onPageChange)
		AppActions.checkAuth()
	}

	componentWillUnmount(){
		AppStore.removeChangeListener(this._onChangeEvent)
		AppStore.removePageChangeListener(this._onPageChangePreaparingApp, this._onPageChange)
	}

	componentWillReceiveProps(nextProps){
		//l('nextProps')
	}

	_onChangeEvent(){
		//l('_onChangeEvent')
		//l('_onChangeEvent : ', AppStore.getState())
		this.setState(AppStore.getState())
	}

	_onPageChangePreaparingApp(){}
	_onPageChange(){
		l('_onPageChange')
		this.setState(AppStore.getState(),() => {
			l(this.state)
		})
	}

	_historyObjGrabber(elem){
		if(this.state._historyObj) return
		
		if(elem && elem.context && elem.context.router && elem.context.router.history){
			var _historyObj = elem.context.router.history
			AppActions.setHistoryObj(_historyObj)
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
					<Route exact path='/' component={Login} />
					<Route path='/register' component={Register} />
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