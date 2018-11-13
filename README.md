# movieApi
ConcertTraveller is a web API that lets a user:
1. add a movie by the title and connect to the external API [http://www.omdbapi.com/](http://www.omdbapi.com/) in order to get additional information
2. get the list of all the movies existing in the database
3. add a comment to a particular movie
4. get the list of all comments existing in the database

## <p align="center"><a href=https://moovieguru.herokuapp.com/api/>movieApi on Heroku</a></p>


Used technologies:
1. Node.js - backend of the app, using Express.js framework
2. Jest - testing framework


## How to use
1. Make sure you have Node.js@8.9.1 and MongoDB@3.6.5 installed to ensure that the app works well
2. Copy the repository

In the terminal:

2. Run `npm install` in the main directory
3. Run `npm start`

Go to [http://localhost:4000](http://localhost:4000) in your favourite browser to use the app.

### Available endpoints

`GET /api/movies` : [https://moovieguru.herokuapp.com/api/movies](https://moovieguru.herokuapp.com/api/movies)

`POST /api/movies` : `https://moovieguru.herokuapp.com/api/movies` : `Content-Type: application/json`


Data params: `{"title": "title of the movie"}`


`GET /api/comments` : [https://moovieguru.herokuapp.com/api/comments](https://moovieguru.herokuapp.com/api/movies)

`POST /api/comments` : `https://moovieguru.herokuapp.com/api/comments` : `Content-Type: application/json`


Data params: `{"movieId": "id of the movie", "comment": "comment to the movie" }`
