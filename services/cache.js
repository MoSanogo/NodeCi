const mongoose = require('mongoose');
const redis = require('redis');
const util = require('util');
const keys = require('../config/keys');
const client = redis.createClient(keys.redisUrl);
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;
mongoose.Query.prototype.cache = function (options = {}) {
	this._useCache = true;
	this._hashKey = JSON.stringify(options.key || '');
	return this;
};
mongoose.Query.prototype.exec = async function () {
	if (!this._useCache) {
		return exec.apply(this, arguments);
	}
	const key = JSON.stringify(Object.assign({}, this.getQuery(), { collection: this.mongooseCollection.name }));

	// Do we have any cache data in redis related to this query;
	const cacheValue = await client.hget(this._hashKey, key);

	// If yes,then respond to the request right away and return ;

	if (cacheValue) {
		const doc = JSON.parse(cacheValue);
		return Array.isArray(doc) ? doc.map((d) => new this.model(d)) : new this.model(doc);
	}
	// if no,we need to respond to request and update our cache to store data ;
	const result = await exec.apply(this, arguments);
	client.hset(this._hashKey, key, JSON.stringify(result), 'EX', 10);
	return result;
};

module.exports = {
	clearHash(hashKey) {
		client.del(JSON.stringify(hashKey));
	},
};
