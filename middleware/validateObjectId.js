const { isValidObjectId } = require('../startup/db');

module.exports = function(req, res, next) {
	if (!isValidObjectId(req.params.id))
		return res.status(404).send('Invalid Id');

	next();
};
