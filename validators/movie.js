const Joi = require('joi');

function validateMovie(movie) {
	const schema = {
		title: Joi.string()
			.min(1)
			.max(128)
			.required()
	};

	return Joi.validate(movie, schema);
}
module.exports = validateMovie;
