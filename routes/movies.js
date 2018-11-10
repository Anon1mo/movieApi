const { Router } = require('express');
const db = require('../startup/db');
const validate = require('../middleware/validate');
const movieValidator = require('../validators/movie');
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

	const movieAlreadyExists = movieCollection.countDocuments(
		{ title },
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

	await movieCollection.insertOne(movie.data);
	res.status(201).send('A movie was successfully added to the database');
});

module.exports = router;
