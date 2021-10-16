const Command = require('../Command');
const { MessageEmbed } = require('discord.js');
const { TrackUtils } = require('erela.js');

module.exports = class LoopCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'loop',
			aliases: ['repeat', 'lp'],
			description: 'Loops the playing track',
			type: client.types.MUSIC
		});
	}


	async run(message) {
		let player = await message.client.Manager.get(message.guild.id);

		if (!player)
			return message.channel.send('>>> **There is nothing playing to loop**');

		if (!message.member.voice.channel)
			return message.channel.send('**Please join a voice channel...**');

		if (
			message.guild.me.voice.channel &&
			message.member.voice.channel.id !== message.guild.me.voice.channel.id
		)
			return message.channel.send(
				':x: | **You must be in the same voice channel as me to use this command!**'
			);

		if (player.trackRepeat) {
			player.setTrackRepeat(false);
			message.channel.send(`Loop has been \`Disabled\` by ${message.author}`);
		} else {
			player.setTrackRepeat(true);
			message.channel.send(`Loop has \`Enabled\` by ${message.author}`);
		}
	}
};
