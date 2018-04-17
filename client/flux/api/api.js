import axios from 'axios'

export default {
	checkAuth(){
		return axios.get('/authStatus')		
	},

	register(formdata){
		// axios dont want to post formdata 
		// so parse data and send
		var data = {}

		for(var [key, value] of formdata.entries()){
			data[key] = value
		}

		return axios.post('/register', data)
	},

	registerCheckUsernameAvailable(username){
		return axios.post('/register/checkUsernameAvailable', {username : username})
	},

	login(formdata){
		// axios dont want to post formdata 
		// so parse data and send
		var data = {}

		for(var [key, value] of formdata.entries()){
			data[key] = value
		}

		return axios.post('/login', data)
	},

	logout(){
		return axios.get('/logout')
	},

	getUserInfo(){
		return axios.get('/user')
	},	



	/**
	*	User
	*/

	userChangeAvatar(formdata){
		return new Promise( (resolve, reject) => {
			var xhr = new XMLHttpRequest()
			xhr.open('POST', '/upload/user/avatar')
			xhr.send(formdata)

			xhr.onerror = (e) => {
				l('ERROR : ', e.target.status)
				reject(e.target.status)
			}

			xhr.onload = function(e){
				l(' LOAD ', e.target.status)
				l(this)
				resolve(this.response)
			}
		})
	},

	userGetAllItems(){
		return axios.get('/upload/user/all')
	},

	userSetAvatar(imgSrc){
		return axios.post('/user/setAvatar', {imgSrc: imgSrc})
	}
}