import React from 'react'
import AppStore from '../flux/stores/AppStore.js'
import './styles/PageLoading.less'

class PageLoading extends React.Component{
	constructor(props){
		super(props)
		this._hideConent_PageLoading = this._hideConent_PageLoading.bind(this)
	}

	componentWillMount(){
		AppStore.addPageChangeListener(this._hideConent_PageLoading)
	}

	componentWillUnmount(){
		AppStore.removePageChangeListener(this._hideConent_PageLoading)
	}

	_hideConent_PageLoading(){
		return new Promise(resolve => {
			setTimeout(() => {
				resolve()
			}, 500)
		})
	}

	render(){
		return(
			<div className='PageLoading'>
				<div className='PageLoading_loader'>L</div>
				<div className='PageLoading_loader'>O</div>
				<div className='PageLoading_loader'>A</div>
				<div className='PageLoading_loader'>D</div>
				<div className='PageLoading_loader'>I</div>
				<div className='PageLoading_loader'>N</div>
				<div className='PageLoading_loader'>G</div>
			</div>
		)
	}
}

export default PageLoading