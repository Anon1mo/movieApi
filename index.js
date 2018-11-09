require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const winston = require('winston');
const db = require('./db');

const error = require('./error');

const app = express();
const port = process.env.PORT || 3000;

db.connect('mongodb://localhost/movieapi').then(() => {
	app.use(morgan('tiny'));
	app.use(express.json());
	require('./logging')();
	require('./validation')();
	const movies = require('./routes/movies');
	const comments = require('./routes/comments');
	app.use('/api/movies', movies);
	app.use('/api/comments', comments);
	app.use(error);

	// mongoose
	// 	.connect('mongodb://localhost/movieApi')
	// 	.then(() => winston.info('connected to the database'));
	app.listen(port, error => {
		if (error) {
			console.log(error);
		} else {
			console.log(`Listening on port ${port}`);
		}
	});
});
