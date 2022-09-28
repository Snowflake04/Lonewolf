const Command = require('../Command');
const { MessageEmbed } = require('discord.js');

module.exports = class ClearCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'clear',
			aliases: ['clrq'],
			description: 'Clears the queue for the server',
			type: client.types.MUSIC
		});
	}

	async run(message, args) {
		let player = await message.client.Manager.get(message.guild.id);
		if (!player)
			return message.channel.send('**There are no music playing now...**');

		if (!player.queue || !player.queue.length || player.queue.length === 0)
			return message.channel.send(
				'>>> **There are no active queue on the server**'
			);

		if (!message.member.voice.channel)
			return message.channel.send(
				'>>> **Please join a voice channel to use this command **'
			);

		if (
			message.guild.me.voice.channel &&
			message.member.voice.channel.id !== message.guild.me.voice.channel.id
		)
			return message.channel.send(
				'>>> **You must be in the same voice channel as me to use this command!**'
			);

		player.queue.clear();
		await message.channel.send('>>> **Queue has be successfully removed**');
	}
};
