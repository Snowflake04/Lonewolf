const config = require('./config.json');
const Client = require("./src/Client.js");

global.__basedir = __dirname;

// Client setup
const client = new Client(config, { intents: [
  	'GUILD_PRESENCES',
	'GUILD_MEMBERS',
	'GUILDS',
	'GUILD_VOICE_STATES',
	'GUILD_MESSAGES',
	'GUILD_MESSAGE_REACTIONS',
  'DIRECT_MESSAGES'
] });

// Initialize client
function init() {
	client.loadEvents('./src/events');
	client.loadCommands('./src/commands');
  require("./player")(client);
  require("./poster")(client);
}

init()

client.login(process.env.token);


process.on('unhandledRejection', err => client.logger.error(err));
