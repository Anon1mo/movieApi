const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

const dbName = 'movieApi';
let _db;
module.exports = {
	connect(url) {
		return new Promise((resolve, reject) => {
			MongoClient.connect(
				url,
				{ useNewUrlParser: true }
			)
				.then(db => {
					_db = db;
					resolve(db);
				})
				.catch(err => reject(err));
		});
	},
	getDatabase() {
		return _db.db();
	},
	getCollection(name) {
		return _db.db().collection(name);
	},
	isValidObjectId(id) {
		return ObjectID.isValid(id);
	},
	createObjectId(id) {
		return new ObjectID(id);
	}
};
