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

	async function createNewMovie(title) {
		const { data: movieId } = await api.post('movies', { title });

		return {
			movieId,
			cleanup() {
				return api.delete(`movies/${movieId}`);
			}
		};
	}
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
});
