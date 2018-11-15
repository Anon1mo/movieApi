const { Router } = require('express');
const db = require('../startup/db');
const validate = require('../middleware/validate');
const movieValidator = require('../validators/movie');
const validateObjectId = require('../middleware/validateObjectId');
const movieService = require('../services/movieService');
const router = new Router();

const collectionName = __filename.slice(__dirname.length + 1, -3); // get filename without directory or extension
const movieCollection = db.getCollection(collectionName);

router.get('/', async (req, res) => {
	const movies = await movieCollection.find({}).toArray();

	res.send(movies);
});

router.post('/', validate(movieValidator), async (req, res) => {
	const { title } = req.body;

	const movieAlreadyExists = await movieCollection.countDocuments(
		{ Title: title },
		{ limit: 1 }
	);
	if (movieAlreadyExists) {
		return res.status(400).send('Movie already exists in a database');
	}

	let movie;
	try {
		movie = await movieService.getMovie(title);
	} catch (ex) {
		return res.status(404).send(ex.error);
	}

	const { insertedId: insertedMovieId } = await movieCollection.insertOne(
		movie.data
	);
	res.status(201).send(insertedMovieId);
});

router.delete('/:id', validateObjectId, async (req, res) => {
	const movie = await movieCollection.deleteOne({
		_id: db.createObjectId(req.params.id)
	});

	if (movie.result.n === 0)
		return res.status(404).send('The movie with the given ID was not found');

	res.send(movie);
});

module.exports = router;
