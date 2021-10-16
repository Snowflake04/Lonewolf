const Command = require('../Command');
const { MessageEmbed } = require('discord.js');
const { TrackUtils } = require('erela.js');

module.exports = class PauseCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pause',
			description: 'Pause, if a song is playing',
			type: client.types.MUSIC
		});
	}


	async run(message) {
		let player = await message.client.Manager.get(message.guild.id);

		if (!player)
			return message.channel.send('**There\'s nothing playing right now to pause...**');

		if (!message.member.voice.channel)
			return message.channel.send(
				'**You have to join a voice channel to use this command**'
			);

		if (
			message.guild.me.voice.channel &&
			message.member.voice.channel.id !== message.guild.me.voice.channel.id
		)
			return message.channel.send(
				'**Oops** | You must be in the same voice channel as me to use this command!'
			);
		if (player.paused) return message.channel.send('**Song already Paused!**');
		player.pause(true);
		message.channel.send('**Paused!**');
	}
};
