const express = require('express');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));
require('./logging')();

app.listen(port, error => {
	if (error) {
		console.log(error);
	} else {
		console.log(`Listening on port ${port}`);
	}
});
