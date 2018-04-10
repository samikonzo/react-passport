import React from 'react'
import { Link } from 'react-router-dom'
import AppActions from '../../flux/actions/AppActions.js'

const l = console.log;


class DelayLink extends React.Component{
	constructor(props){
		super(props)
		this.handleClick = this.handleClick.bind(this)
	}


	handleClick(e){
		e.preventDefault()

		const { replace, to} = this.props
		const { history: historyObj  } = this.context.router

		AppActions.pageRedirectTo(to, historyObj)

	}

	render(){
		const props = Object.assign({}, this.props)

		return( 
			<Link {...props} onClick={this.handleClick} />
		)
	}
}

DelayLink.contextTypes = Link.contextTypes;


export default DelayLink