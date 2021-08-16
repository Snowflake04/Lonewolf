const Command = require('../Command');
const { MessageEmbed } = require('discord.js');
const { TrackUtils } = require('erela.js');

module.exports = class LyricsCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'pause',
			description: 'Pause, if a song is playing',
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
	async run(message) {
		let player = await message.client.Manager.get(message.guild.id);

		if (!player)
			return message.channel.send('**Theres nothing playing right now...**');

		if (!message.member.voice.channel)
			return message.channel.send(
				'**You have to join a voice channel to use this command**'
			);

		if (
			message.guild.me.voice.channel &&
			message.member.voice.channel.id !== message.guild.me.voice.channel.id
		)
			return message.channel.send(
				':x: | **You must be in the same voice channel as me to use this command!**'
			);
		if (player.paused) return message.channel.send('**Song already Paused!**');
		player.pause(true);
		message.channel.send('**Paused!**');
	}
};
