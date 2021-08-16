const Command = require('../Command');
const { MessageEmbed } = require('discord.js');
const { TrackUtils } = require('erela.js');
const util = require('../../utils');

module.exports = class RemoveCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'remove',
			aliases: ['rm'],
			usage: 'remove <queue_no.>',
			description: 'Remove a song from the queue',
			type: client.types.MUSIC
		});
	}

	/**
	 *
	 * @param {import("../structures/DiscordMusicBot")} client
	 * @param {import("discord.js").Message} message
	 * @param {string[]} args
	 * @param {*} param3
	 */
	async run(message, args) {
		let player = await message.client.Manager.players.get(message.guild.id);
		const song = player.queue.slice(args[0] - 1, 1);

		if (!player)
			return message.channel.send('**No songs are playing to remove...**');

		if (!message.member.voice.channel)
			return message.channel.send(
				'**Please join a voice channel before using the command**'
			);
		if (
			message.guild.me.voice.channel &&
			message.member.voice.channel.id !== message.guild.me.voice.channel.id
		)
			return message.channel.send(
				':x: | **You must be in the same voice channel as me to use this command!**'
			);

		if (!player.queue || !player.queue.length || player.queue.length === 0)
			return message.channel.send('There is nothing in the queue to remove');
		let rm = new MessageEmbed()
			.setDescription(
				` Successfully Removed track **\`${Number(args[0])}\`** from the queue!`
			)
			.setColor('GREEN');
		if (isNaN(args[0])) rm.setDescription(`**Usage - **\`remove [track]\``);
		if (args[0] > player.queue.length)
			rm.setDescription(`The queue has only ${player.queue.length} songs!`);
		await message.channel.send(rm);
		player.queue.remove(Number(args[0]) - 1);
	}
};
