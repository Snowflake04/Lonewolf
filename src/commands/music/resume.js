const Command = require('../Command');
const { MessageEmbed } = require('discord.js');
const { TrackUtils } = require('erela.js');

module.exports = class ResumeCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'resume',
			aliases: ['res'],
			description: 'Resumes any paused song on the guild',
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
			return message.channel.send('**No songs paused to resume ;-;**');
		if (!message.member.voice.channel)
			return message.channel.send(
				'**Pleqse join a voice channel to use this command**'
			);

		if (
			message.guild.me.voice.channel &&
			message.member.voice.channel.id !== message.guild.me.voice.channel.id
		)
			return message.channel.send(
				':x: | **You must be in the same voice channel as me to use this command!**'
			);

		if (player.playing)
			message.channel.send('**Music is already playing dummy ;-;**');
		player.pause(false);
		message.channel.send('**Successfully resumed!**');
	}
};
