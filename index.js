require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const db = require('./startup/db');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));

if (process.env.NODE_ENV === 'production') {
	require('./startup/prod')(app);
	console.log('production');
}

db.connect('mongodb://localhost/movieapi').then(() => {
	require('./startup/config')();
	require('./startup/logging')();
	require('./startup/validation')();
	require('./startup/routes')(app);

	app.listen(port, error => {
		if (error) {
			console.log(error);
		} else {
			console.log(`Listening on port ${port}`);
		}
	});
});
