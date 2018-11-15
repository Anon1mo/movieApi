const axios = require('axios');
const startServer = require('../../startServer');
const { isValidObjectId } = require('../../startup/db');

jest.mock('../../services/movieService', () => {
	return {
		getMovie: jest.fn(movie => Promise.resolve({ data: { Title: movie } }))
	};
});

const api = axios.create({
	baseURL: `http://localhost:${process.env.PORT}/api`,
	params: ''
});

let server;

beforeAll(async () => {
	server = await startServer();
});

afterAll(done => {
	server.close(done);
});

describe('movie API', () => {
	test('can get movies from the API', async () => {
		const { data: movies } = await api.get('movies');
		movies.forEach(movie => {
			expect(movie).toMatchObject({
				Title: expect.any(String)
			});
		});
	});

	test('can post a valid movie using the API', async () => {
		const movieTitle = 'Zelig';
		const { movieId, cleanup } = await createNewMovie(movieTitle);
		expect(isValidObjectId(movieId)).toBe(true);

		await cleanup();
	});

	test('cannot post a movie with no title using the API', async () => {
		const movieTitle = '';
		await createNewMovie(movieTitle).catch(err => {
			expect(err.response.status).toBe(400);
		});
	});

	test('cannot post the same movie twice using the API', async () => {
		const movieTitle = 'Zelig';
		const { movieId, cleanup } = await createNewMovie(movieTitle);
		expect(isValidObjectId(movieId)).toBe(true);
		await createNewMovie(movieTitle).catch(err => {
			expect(err.response.status).toBe(400);
		});

		await cleanup();
	});
});

describe('comments API', () => {
	test('can get comments from the API', async () => {
		const { data: comments } = await api.get('comments');
		comments.forEach(oneComment => {
			expect(oneComment).toMatchObject({
				comment: expect.any(String)
			});
		});
	});

	test('can post post a valid comment to a movie', async () => {
		const movieTitle = 'Sleeper';
		const movieManager = await createNewMovie(movieTitle);
		const comment = {
			movieId: movieManager.movieId,
			comment: 'test'
		};

		const commentManager = await createNewComment(comment);
		expect(isValidObjectId(commentManager.commentId)).toBe(true);

		await movieManager.cleanup();
		await commentManager.cleanup();
	});

	test('cannot post a valid comment to the movie, which does not exist', async () => {
		const comment = {
			movieId: '1234',
			comment: 'test'
		};

		await createNewComment(comment).catch(err => {
			expect(err.response.status).toBe(400);
		});
	});

	test('cannot post a too long comment to the movie', async () => {
		const movieTitle = 'Sleeper';
		const movieManager = await createNewMovie(movieTitle);
		const comment = {
			movieId: movieManager.movieId,
			comment: `Lorem ipsum dolor sit amet, vim elit scaevola at, vix ei vide fierent argumentum. 
								Paulo definiebas id qui, ius in deserunt euripidis similique, sed cu accusata ocurreret.
				 				Purto definitiones delicatissimi et ius. Adhuc vituperatoribus no nec. Utroque appetere
				  			qui ad, eu eos purto quaestio.`
		};

		await createNewComment(comment).catch(err => {
			expect(err.response.status).toBe(400);
		});

		await movieManager.cleanup();
	});
});

async function createNewMovie(title) {
	const { data: movieId } = await api.post('movies', { title });

	return {
		movieId,
		cleanup() {
			return api.delete(`movies/${movieId}`);
		}
	};
}

async function createNewComment(comment) {
	const { data: commentId } = await api.post('comments', comment);
	return {
		commentId,
		cleanup() {
			return api.delete(`comments/${commentId}`);
		}
	};
}
