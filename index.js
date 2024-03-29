const config = require("./config.json");
const Client = require("./src/Client.js");

global.__basedir = __dirname;

// Client setup
const client = new Client(config, {
  intents: [
  'GUILD_PRESENCES',
	'GUILD_MEMBERS',
	'GUILDS',
	'GUILD_VOICE_STATES',
	'GUILD_MESSAGES',
	'GUILD_MESSAGE_REACTIONS',
  'DIRECT_MESSAGES'
]
});

// Initialize client
function init() {
  client.loadEvents('./src/events');
  client.loadCommands('./src/commands');
  require("./src/player")(client);
//Uncomment next line to post to Top.gg website or else leave as is
  //require("./src/poster")(client); 
}

init()

client.login(process.env.token);


process.on('unhandledRejection', err => client.logger.error(err));

//Too lazy and too crazy
global.wait = function wait(ms){ return new Promise(res => setTimeout(res, ms))};
