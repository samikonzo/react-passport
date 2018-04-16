import React from 'react'
import Delaylink from './etc/Delaylink.jsx'
import AppActions from '../flux/actions/AppActions.js'
import AppStore from '../flux/stores/AppStore.js'
import AuthStore from '../flux/stores/AuthStore.js'

import './styles/Menu.less'
// components
import LogoutBtn from './LogoutBtn.jsx'



class Menu extends React.Component{
	constructor(props){
		super(props)

		this._onLogoutClick_Menu = this._onLogoutClick_Menu.bind(this)
	}

	_onLogoutClick_Menu(e){
		e.preventDefault()
		AppActions.authLogout()
	}

	render(){
		return(
			<div className='Menu'>
				<Delaylink to="/"  _class='Menu_item'>Home</Delaylink>
				<Delaylink to="/contacts" _class='Menu_item'>Contacts</Delaylink>
				<Delaylink to="/items" _class='Menu_item'>Items</Delaylink>
				<a className="Menu_item" href='#' onClick={this._onLogoutClick_Menu}> Logout </a>
			</div>
		)
	}
}

export default Menu