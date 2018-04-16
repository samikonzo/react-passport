import Dispatcher from '../dispatcher/AppDispatcher.js'
import Constants from '../constants/AppConstants.js'
import api from '../api/api.js'

export default {
	userChangeAvatar(formdata){
		Dispatcher.dispatch({
			type: Constants.USER_CHANGE_AVATAR
		})

		api.userChangeAvatar(formdata)
			.then(
				src => {

					l(src)
					//l('userChangeAvatar result : ', result)
					//l(result.avatar)

					Dispatcher.dispatch({
						type: Constants.USER_CHANGE_AVATAR_SUCCESS,
						src: src
					})
				},

				error => {

					l('userChangeAvatar error : ', error)
					
					Dispatcher.dispatch({
						type: Constants.USER_CHANGE_AVATAR_FAIL,
						//img : result.data
					})
				}
			)
	},
}