const AWS = require('aws-sdk');
const { v1 } = require('uuid');
const requireLogin = require('../middlewares/requireLogin');
const keys = require('../config/keys');
const s3 = new AWS.S3({
	accessKeyId: keys.accessKeyId,
	secretAccessKey: keys.secretAccessKey,
	region: keys.region,
});
module.exports = (app) => {
	app.get('/api/upload', requireLogin, (req, res) => {
		const key = `${req.user.id}/${v1()}.jpeg`;
		s3.getSignedUrl(
			'putObject',
			{
				Bucket: 'modibo-sanogo-1234',
				ContentType: 'image/jpeg',
				Key: key,
			},
			(err, url) => {
				if (err) console.error(err);
				res.send({ key, url });
			}
		);
	});
};
