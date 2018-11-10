const { Router } = require('express');
const db = require('../startup/db');
const validate = require('../middleware/validate');
const commentValidator = require('../validators/comment');
const router = new Router();

const collectionName = __filename.slice(__dirname.length + 1, -3); // get filename without directory or extension
const commentsCollection = db.getCollection(collectionName);

router.get('/', async (req, res) => {
	const comments = await commentsCollection.find({}).toArray();

	res.send(comments);
});

router.post('/', validate(commentValidator), async (req, res) => {
	const { movieId, comment } = req.body;
	// check if id is valid and comment is not too long
	const commentObj = { movieId: db.createObjectId(movieId), comment };

	await commentsCollection.insertOne(commentObj);

	res.status(201).send();
});

module.exports = router;
