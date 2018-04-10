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

				<div className="Loading_text">
					<div className="Loading_char">L</div>
					<div className="Loading_char">O</div>
					<div className="Loading_char">A</div>
					<div className="Loading_char">D</div>
					<div className="Loading_char">I</div>
					<div className="Loading_char">N</div>	
					<div className="Loading_char">G</div>	
				</div>



				{/*<div className={className}>
				<div>L</div>
				<div>O</div>
				<div>A</div>
				<div>D</div>
				<div>I</div>
				<div>N</div>	
				<div>G</div>	
				<div>.</div>
				<div>.</div>
				<div>.</div>
			</div>*/}

			</div>
			
		)
	}
}

export default Loading