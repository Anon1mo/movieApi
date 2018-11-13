require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const db = require('./startup/db');

async function startServer() {
	const app = express();
	const port = process.env.PORT || 3000;

	app.use(morgan('tiny'));

	if (process.env.NODE_ENV === 'production') {
		require('./startup/prod')(app);
		console.log('production');
	}

	const dbConnection = await db.connect(process.env.DB);
	require('./startup/config')();
	require('./startup/logging')();
	require('./startup/validation')();
	require('./startup/routes')(app);
	return new Promise((resolve, reject) => {
		const server = app.listen(port, error => {
			if (error) {
				console.log(error);
				reject(error);
			} else {
				console.log(`Listening on port ${port}`);
			}
		});
		server.on('close', () => {
			dbConnection.close();
		});
		resolve(server);
	});
}
module.exports = startServer;
