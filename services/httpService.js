const axios = require('axios');

const apiUrl = 'http://www.omdbapi.com/';

axios.defaults.baseURL = apiUrl;
axios.defaults.params = { apiKey: process.env.API_KEY };
axios.interceptors.response.use(null, error => {
	const expectedError =
		error.response &&
		error.response.status >= 400 &&
		error.response.status < 500;

	if (!expectedError) {
		console.log(error);
	}

	return Promise.reject(error);
});

module.exports = {
	get: axios.get,
	post: axios.post,
	put: axios.put,
	delete: axios.delete
};
