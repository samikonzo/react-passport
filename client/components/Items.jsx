import React from 'react'
import AppActions from '../flux/actions/AppActions.js'
import AppStore from '../flux/stores/AppStore.js'
import AuthStore from '../flux/stores/AuthStore.js'
import Item from './Item.jsx'

import './styles/Items.less'

class Items extends React.Component{
	constructor(props){
		super(props)

		this.state = {
			Auth_userAllItems: AuthStore.getAllItems(),
			show: false,
		}

		this._showConent_Items = this._showConent_Items.bind(this)
		this._hideConent_Items = this._hideConent_Items.bind(this)
		this._onAuthChange_Items = this._onAuthChange_Items.bind(this)
		this._changeAvatar_Items = this._changeAvatar_Items.bind(this)
	}

	componentWillMount(){
		AppStore.addPageChangeListener(this._hideConent_Items)
		AuthStore.addChangeListener(this._onAuthChange_Items)

		if(!this.state.items) AppActions.userGetAllItems()
	}

	componentDidMount(){
		this._showConent_Items()
	}

	componentWillUnmount(){
		AppStore.removePageChangeListener(this._hideConent_Items)
		AuthStore.removeChangeListener(this._onAuthChange_Items)
	}

	_showConent_Items(){
		setTimeout(() => {
			this.setState({
				show: true
			})
		}, 50)
	}

	_hideConent_Items(){
		return new Promise( (resolve, reject) => {
			this.setState({
				show: false
			}, () => {
				setTimeout(resolve, 1000)
			})
		})
	}

	_onAuthChange_Items(){
		this.setState(AuthStore.getState(), () => {
			//this._showConent_Items()
		})
	}

	_changeAvatar_Items(imgSrc){
		l(imgSrc)
		AppActions.userSetAvatar(imgSrc)
	}


	render(){
		//l(this.state)
		
		var ItemsClassname = 'Items '
		if(!this.state.show) ItemsClassname += 'Items--hidden'

		var avatarSrc = this.state.Auth_user && 
						this.state.Auth_user.avatar &&
						this.state.Auth_user.avatar.split(this.state.Auth_user.username)[1]



		return (
			<div className={ItemsClassname}>
				{this.state.Auth_userAllItems && this.state.Auth_userAllItems.map((imgSrc, key) => {
					var isAvatar = imgSrc.split(this.state.Auth_user.username)[1] == avatarSrc

					return <Item 
							key={key}
							imgSrc={imgSrc}
							isAvatar={isAvatar}
							selectAsAvatar={this._changeAvatar_Items}
						/>
				})}
			</div>
		)
	}
}

export default Items