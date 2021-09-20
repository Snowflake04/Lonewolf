const config = require('./config.json');
const Client = require('./src/Client.js');
const { Intents } = require('discord.js');
const { AutoPoster } = require('topgg-autoposter');

global.__basedir = __dirname;

// Client setup
const intents = new Intents();
intents.add(
	'GUILD_PRESENCES',
	'GUILD_MEMBERS',
	'GUILDS',
	'GUILD_VOICE_STATES',
	'GUILD_MESSAGES',
	'GUILD_MESSAGE_REACTIONS',
        'DIRECT_MESSAGES'
);
const client = new Client(config, { ws: { intents: intents } });
require('discord-buttons')(client);
client.Manager = require('./manager')(client);
client.Lavasfy = require('./spotify')(client);
// Initialize client
function init() {
	client.loadEvents('./src/events');
	client.loadCommands('./src/commands');
	client.loadTopics('./data/trivia');
	client.login(process.env.token);
}

const ap = AutoPoster(
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc5NTk1MjUzMDczNTEwNDAxMCIsImJvdCI6dHJ1ZSwiaWF0IjoxNjI0MTk2MDE2fQ.XSXQZnZBaFAJG4R7dndhlmUVz1X_fd0IG1Uq2gsJpIg',
	client
);

ap.on('posted', () => {
	console.log('Posted stats to Top.gg!');
});
init();

process.on('unhandledRejection', err => client.logger.error(err));
