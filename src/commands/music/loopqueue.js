const Command = require('../Command');
const { MessageEmbed } = require('discord.js');
const { TrackUtils } = require('erela.js');

module.exports = class LoopQueueCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'loopqueue',
			aliases: ['lq', 'loopall'],
			description: 'Loops all the song in the queue',
			type: client.types.MUSIC
		});
	}


	async run(message) {
		let player = await message.client.Manager.get(message.guild.id);

		if (!player) return message.channel.send('**There is no queue to loop**');

		if (!message.member.voice.channel)
			return message.channel.send('**Please join a voice channel first!...**');

		if (
			message.guild.me.voice.channel &&
			message.member.voice.channel.id !== message.guild.me.voice.channel.id
		)
			return message.channel.send(
				':x: | **You must be in the same voice channel as me to use this command!**'
			);

		if (player.queueRepeat) {
			player.setQueueRepeat(false);
			message.channel.send(`: Queue Loop has been \`disabled\` by ${message.author}`);
		} else {
			player.setQueueRepeat(true);
			message.channel.send(
				`:repeat: Queue Loop has been \`enabled\` by ${message.author}`
			);
		}
	}
};
