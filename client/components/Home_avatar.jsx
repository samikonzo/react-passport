import React from 'react'
import AppActions from '../flux/actions/AppActions.js'

import './styles/Home_avatar.less'

class HomeAvatar extends React.Component{
	constructor(props){
		super(props)

		this.state = props

		this._onChangeImage = this._onChangeImage.bind(this)
	}

	componentWillReceiveProps(nextProps){
		this.setState(nextProps)
	}


	_onChangeImage(e){
		if(!e.target.files || !e.target.files[0]) return

		if(!e.target.files[0].type.includes('image')){
			l(' THIS IS NOT IMAGE!! ')
			return
		}

		var data = new FormData(this.avatar_changeForm)

		AppActions.userChangeAvatar(data)
	}

	render(){
		//l(this.state)

		//var src = this.state.avatar

		//var imgSrc = this.state.avatar && this.state.avatar.src
		//

		//var loadingClass = 'Home-avatar_loading '
		//if(this.state.avatar && this.state.avatar.isLoading) loadingClass += 'Home-avatar_loading--showed'

		var imgSrc = this.state.avatar
		var imgClass = 'Home-avatar_img '
		if(!this.state.avatar) imgClass += 'Home-avatar_img--empty'


		var loadingClass = 'Home-avatar_loading '

		return(
			<div className="Home-avatar_wrapper">

				<form ref={elem => this.avatar_changeForm = elem}>
					<label className="Home-avatar_changeButton"> 
						change avatar
						<input type="file" name="avatar" accept="image/*" onChange={this._onChangeImage} /> 
					</label>
				</form>

				<img className={imgClass} src={imgSrc}/>
				<div className={loadingClass}> </div>
			</div>
		)
	}
}

export default HomeAvatar