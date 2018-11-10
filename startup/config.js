module.exports = function() {
	if (!process.env.API_KEY) {
		throw new Error('ERROR: API_KEY is not defined as environmental variable');
	}
};
