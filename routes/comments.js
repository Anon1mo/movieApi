const { Router } = require('express');
const db = require('../startup/db');
const validate = require('../middleware/validate');
const commentValidator = require('../validators/comment');
const validateObjectId = require('../middleware/validateObjectId');
const router = new Router();

const collectionName = __filename.slice(__dirname.length + 1, -3); // get filename without directory or extension
const commentsCollection = db.getCollection(collectionName);

router.get('/', async (req, res) => {
	const comments = await commentsCollection.find({}).toArray();

	res.send(comments);
});

router.post('/', validate(commentValidator), async (req, res) => {
	const { movieId, comment } = req.body;
	const commentObj = { movieId: db.createObjectId(movieId), comment };

	const { insertedId: insertedCommentId } = await commentsCollection.insertOne(
		commentObj
	);

	res.status(201).send(insertedCommentId);
});

router.delete('/:id', validateObjectId, async (req, res) => {
	const comment = await commentsCollection.deleteOne({
		_id: db.createObjectId(req.params.id)
	});

	if (comment.result.n === 0)
		return res.status(404).send('The comment with the given ID was not found');

	res.send(comment);
});

module.exports = router;
