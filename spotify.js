const { LavasfyClient } = require('lavasfy');
const config = require('./config');

module.exports = function(client) {
	return new LavasfyClient(
		{
			clientID: config.scldid,
			clientSecret: config.scldsc
		},
		[
			{
				id: config.id,
				host: config.host,
				port: config.port,
				password: config.pass
			}
		]
	);
};
