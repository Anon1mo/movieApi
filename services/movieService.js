const http = require('./httpService');

const queryParameter = 't';

function getMovie(movieTitle) {
	return http.get(
		`?apiKey=${process.env.API_KEY}&${queryParameter}=${movieTitle}`
	);
}

module.exports = {
	getMovie
};
