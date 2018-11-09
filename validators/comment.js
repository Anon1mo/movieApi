const Joi = require('joi');

function validateComment(comment) {
	const schema = {
		movieId: Joi.objectId().required(),
		comment: Joi.string()
			.min(1)
			.max(255)
			.required()
	};

	return Joi.validate(comment, schema);
}

module.exports = validateComment;
