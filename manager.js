const { Manager } = require('erela.js');

const config = require('./config');

module.exports = function(client) {
	return new Manager({
		nodes: [
			{
				host: 'n3.nighthost.tech',

				port: 26777,

				password: 'password111'
			},

			{
				host: 'lava2.danbot.host',

				port: 2333,

				password: 'DBH'
			},
			{
				host: 'node3.noldpvp.cf',
				port: 25570,
				password: 'youshallnotpass'
			},

			{
				host: config.host,

				port: config.port,

				password: config.pass
			}
		],

		send(id, payload) {
			const guild = client.guilds.cache.get(id);

			if (guild) guild.shard.send(payload);
		}
	})

		.on('nodeConnect', node =>
			console.log(`Node ${node.options.identifier} connected`)
		)

		.on('nodeError', (node, error) =>
			console.log(
				`Node ${node.options.identifier} had an error: ${error.message}`
			)
		)

		.on('trackStart', (player, track) => {
			require('./src/event').nowPlaying(client, player, track);
		})

		.on('queueEnd', player => {
			let chan = client.channels.cache.get(player.textChannel);
			chan.send('Queue has ended.');
			setTimeout(() => {
				chan.send('**I left due to inactivity...**');

				player.destroy();
			}, 30000);
		});
};
