import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'
import Login from '../components/Login.jsx'
import Register from '../components/Register.jsx'
import AppActions from '../flux/actions/AppActions.js'
import AppStore from '../flux/stores/AppStore.js'

class App extends React.Component{
	constructor(props){
		super(props)

		this.state = {
			isLoading: false,
			isLogged : false,
		}

		this._onChangeEvent = this._onChangeEvent.bind(this)
		this._onPagePreaparing = this._onPagePreaparing.bind(this)
		this._onPageChange = this._onPageChange.bind(this)
	}

	componentWillMount(){
		AppStore.addChangeListener(this._onChangeEvent)
		AppStore.addPageChangeListener(this._onPagePreaparing, this._onPageChange)

	}

	componentWillUnmount(){
		AppStore.removeChangeListener(this._onChangeEvent)
		AppStore.removePageChangeListener(this._onPagePreaparing, this._onPageChange)
	}


	_onChangeEvent(){}
	_onPagePreaparing(){}
	_onPageChange(){}


	render(){

		var AppBody

		if(this.state.isLogged){
			AppBody = (	
				<Switch> 
					<Route exact path='/' component={Home} />
					<Route path='/contacts' component={Contacts} />
				</Switch>
			)
		} else {
			AppBody = (
				<Switch> 
					<Route exact path='/' component={Login} />
					<Route path='/register' component={Register} />
				</Switch> 
			)
		}


		return (
			<div> 
				{AppBody}
			</div>
		)
	}
}



const Home = () => {
	return(
		<div>Home</div>
	)
}

const Contacts = () => {
	return(
		<div>Contacts</div>
	)
}


export default App