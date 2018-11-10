const express = require('express');
const movies = require('../routes/movies');
const comments = require('../routes/comments');
const error = require('../middleware/error');

module.exports = app => {
	app.use(express.json());
	app.use('/api/movies', movies);
	app.use('/api/comments', comments);
	app.use(error);
};
