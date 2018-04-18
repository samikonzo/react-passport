import React from 'react'

import './styles/Item.less'


class Item extends React.Component{
	constructor(props){
		super(props)

		this.state = Object.assign({
			imgLoad: false
		}, props)
		

		this._selectAsAvatar_Item = this._selectAsAvatar_Item.bind(this)
		this._removeItem_Item = this._removeItem_Item.bind(this)
	}

	componentDidMount(){
		this.img.onload = (e) => {
			this.setState({
				imgLoad: true
			})
		}

		this.img.onprogress = (e) => {
			l(e.loaded / e.total)
		}

		// get natural width/height
		var that = this
		setTimeout(function f(){
			if(!that.img.naturalWidth){
				setTimeout(f, 10)
				return
			}

			that.setState({
				imgSize : {
					width: that.img.naturalWidth,
					height: that.img.naturalHeight,
				}
			})
		}, 10)
	}

	componentWillReceiveProps(nextProps){
		this.setState(nextProps)
	}


	_selectAsAvatar_Item(){
		this.state.selectAsAvatar(this.state.imgSrc)
	}

	_removeItem_Item(){
		this.setState({
			removed: true
		}, () => {
			this.state.removeItem(this.state.imgSrc)
		})
	}

	render(){
		var ItemClassname = 'Item '
		if(this.state.isAvatar) ItemClassname += 'Item--avatar '
		if(!this.state.imgLoad) ItemClassname += 'Item--loading '
		if(!this.state.imgSize) ItemClassname += 'Item--nosize '
		if(this.state.removed){
			l('item wait for removing')
			l(this.state.imgSrc)
			ItemClassname += 'Item--removed '			
		}

		var LoadingClassName = 'Item_loading '
		if(!this.state.imgLoad) LoadingClassName += 'Item_loading--show '



		return(
			<div className={ItemClassname}>
				<img src={this.state.imgSrc} ref={elem => this.img = elem} className='Item_img'/>
				<div className='Item_setAvatarBtn' 
					title="set as avatar" 
					onClick={this._selectAsAvatar_Item}> A </div>
				<div className='Item_removeItemBtn' 
					title="remove img"
					onClick={this._removeItem_Item}> X </div>					
				<div className={LoadingClassName}></div>
			</div>
		)
	}
}

export default Item