import React from 'react'
import AppActions from '../flux/actions/AppActions.js'

class Logout extends React.Component{
	render(){
		return(
			<div>
				<button onClick={AppActions.logout}> logout </button>
			</div>
		)
	}
}

export default Logout