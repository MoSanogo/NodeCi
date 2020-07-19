require('../models/User');
const keys = require('../config/keys');
const mongoose = require('mongoose');

beforeAll(async () => {
	await mongoose.connect(keys.mongoURI, { useUnifiedTopology: true, useNewUrlParser: true });
});
afterAll(async () => {
	await mongoose.disconnect();
});
