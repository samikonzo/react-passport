import React from 'react'

import './styles/Item.less'


class Item extends React.Component{
	constructor(props){
		super(props)

		this.state = props

		this._selectAsAvatar_Item = this._selectAsAvatar_Item.bind(this)
	}

	componentWillReceiveProps(nextProps){
		this.setState(nextProps)
	}


	_selectAsAvatar_Item(){
		this.state.selectAsAvatar(this.state.imgSrc)
	}

	render(){
		var ItemClassname = 'Item '
		if(this.state.isAvatar) ItemClassname += 'Item--avatar '


		return(
			<div className={ItemClassname}>
				<img src={this.state.imgSrc} className='Item_img'/>
				<div className='Item_setAvatarBtn' 
					onClick={this._selectAsAvatar_Item}> A </div>
			</div>
		)
	}
}

export default Item