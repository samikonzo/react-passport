import React from 'react'
import AppStore from '../flux/stores/AppStore.js'


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
			var i = 0
			var interval = setInterval( () => {
				l('time : ', i++)
			}, 100)

			setTimeout(() => {
				resolve()
				clearInterval(interval)
			}, 500)
		})
	}

	render(){
		return(
			<div> PageLoading </div>
		)
	}
}

export default PageLoading