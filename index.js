const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const helmet = require('helmet');

require('./models/User');
require('./models/Blog');
require('./services/passport');
require('./services/cache');
mongoose.connect(keys.mongoURI, { useUnifiedTopology: true, useNewUrlParser: true });

const app = express();

app.use([bodyParser.json()]);
app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000,
		keys: [keys.cookieKey],
		signed: false,
	})
);
app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);
require('./routes/blogRoutes')(app);
require('./routes/uploadRoutes')(app);
if (process.env.NODE_ENV === 'production' || 'ci') {
	const path = require('path');
	//Express will serve up production assets like our main.js file ,or main.css file;
	// 'client/build'
	app.use(express.static(path.resolve(__dirname, 'client', 'build')));
	//Express will serve up the index.html  file if it does not recognize the route;

	app.get('*', (req, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
	});
}
const PORT = process.env.PORT || 5000;
app.listen(PORT);
