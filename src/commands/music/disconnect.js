const Command = require('../Command');
const { MessageEmbed } = require('discord.js');

module.exports = class LeaveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'leave',
			aliases: ['stop', 'quit'],
			description: 'Stops the music and disconnects me from the voice channel',
			type: client.types.MUSIC
		});
	}

	async run(message) {
		let player = await message.client.Manager.get(message.guild.id);
		if (!message.member.voice.channel)
			return message.channel.send(
				'>>> **Please join the same voice channel as me to use this command**'
			);
		if (!player) return message.channel.send('**Nothing is playing ;-;**');
		await message.channel.send('>>> **Successfully Disconnected!**');
		player.destroy();
	}
};
