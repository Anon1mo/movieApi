const http = require('./httpService');

const queryParameter = 't';

function getMovie(movieTitle) {
	return http.get(`?${queryParameter}=${movieTitle}`);
}

module.exports = {
	getMovie
};
