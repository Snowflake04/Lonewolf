const Command = require('../Command');
const { MessageEmbed } = require('discord.js');
const prettyMilliseconds = require('pretty-ms');
const util = require('../../utils');
module.exports = class GrabCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'grab',
			aliases: ['save'],
			description: 'Saves the current song to your Dm',
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
		let prefix = await util.getprefix(message.guild.id);
		let player = await message.client.Manager.get(message.guild.id);

		if (!player)
			return message.channel.send('**There are no songs playing now...**');

		if (!message.member.voice.channel)
			return message.channel.send(
				'**You have to be in a voice channel to use this command**'
			);

		if (
			message.guild.me.voice.channel &&
			message.member.voice.channel.id !== message.guild.me.voice.channel.id
		)
			return message.channel.send(
				':x: | **You must be in the same voice channel as me to use this command!**'
			);
		message.author
			.send(
				new MessageEmbed()
					.setAuthor(
						`Grabbed song`,
						message.client.user.displayAvatarURL({
							dynamic: true
						})
					)
					.setThumbnail(
						`https://img.youtube.com/vi/${
							player.queue.current.identifier
						}/mqdefault.jpg`
					)
					.setURL(player.queue.current.uri)
					.setColor('RANDOM')
					.setTitle(`**${player.queue.current.title}**`)
					.addField(
						`⌛ Duration: `,
						`\`${prettyMilliseconds(player.queue.current.duration, {
							colonNotation: true
						})}\``,
						true
					)
					.addField(`🎵 Author: `, `\`${player.queue.current.author}\``, true)
					.setTimestamp()
			)
			.catch(e => {
				return message.channel.send('**:x: Your DMs are disabled**');
			});

		message.channel.send('**Saved to your Dms**');
	}
};
