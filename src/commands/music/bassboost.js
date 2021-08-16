const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { TrackUtils } = require('erela.js');
const levels = {
	none: 0.0,
	low: 0.2,
	medium: 0.3,
	high: 0.35
};
module.exports = class BassCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'bass',
			aliases: ['eq'],
			usage: 'bass <none/low/medium/high>',
			description: 'sets the level of bass for the song',
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
		let player = await message.client.Manager.get(message.guild.id);

		if (!player)
			return message.channel.send('**No songs playing right now!...**');

		if (!message.member.voice.channel)
			return message.channel.send(
				'**Please join a voice channel before using this command...**'
			);

		if (
			message.guild.me.voice.channel &&
			message.member.voice.channel.id !== message.guild.me.voice.channel.id
		)
			return message.channel.send(
				':x: | **You must be in the same voice channel as me to use this command!**'
			);

		if (!args[0])
			return message.channel.send(
				'**Please provide a bassboost level. use `help bass` for more info'
			); //if the user do not provide args [arguments]

		let level = 'none';
		if (args.length && args[0].toLowerCase() in levels)
			level = args[0].toLowerCase();

		player.setEQ(
			...new Array(3)
				.fill(null)
				.map((_, i) => ({ band: i, gain: levels[level] }))
		);

		return message.channel.send(`**Active EQ set to **${level}`);
	}
};
