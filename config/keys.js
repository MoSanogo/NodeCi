//Keys.js -figure out what set of credentials to return;
if (process.env.NODE_ENV === 'production') {
	//we are in production -return the prod set of keys.
	module.exports = require('./prod');
} else if (process.env.NODE_ENV === 'ci') {
	module.exports = require('./ci');
} else {
	//we are in development -retrn the dev set of keys.
	module.exports = require('./dev');
}
