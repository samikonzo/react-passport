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
	}
}