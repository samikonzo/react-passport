import React from 'react'
import './styles/Loading.less'

class Loading extends React.Component{

	constructor(props){
		super(props)

		this.state = {
			showed: this.props.showed,
		}
	}

	componentWillReceiveProps(nextProps){
		this.setState(nextProps)
	}

	render(){
		var className = 'Loading '
		if(this.state.showed) className += 'Loading--showed'

		return(
			<div className={className}> 
				<div className='Loading_background'></div>

				{/*<div className="Loading_text">
					<div className="Loading_char">LOADING</div>
				</div>*/}
			</div>
			
		)
	}
}

export default Loading