const { Manager } = require('erela.js');
const { LavasfyClient } = require('lavasfy')
const config = require('./config');
let nodes = [
                       {
                           host: 'lava.link',
                           port: 80,
                           password: "nothing"
                      },
			{
				host: 'lava2.danbot.host',

				port: 2333,

				password: 'DBH'
			},
			{
				host: config.host,

				port: config.port,

				password: config.pass
			}
		]
module.exports = function(client) {
client.Manager = new Manager({
		nodes: nodes,

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
  
client.Lavasfy = new LavasfyClient(
		{
			clientID: config.scldid,
			clientSecret: config.scldsc
		},
		nodes
	);
};

