const Command = require('../Command');
const { MessageEmbed } = require('discord.js');
const _ = require('lodash');
const prettyMilliseconds = require('pretty-ms');
const Pagination = require('../pagination');

module.exports = class QueueCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'queue',
			aliases: ['q'],
			description: 'Shows the current queue of the server',
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
			return message.channel.send('**There is nothing playing right now ;-;**');

		if (!player.queue || !player.queue.length || player.queue === 0) {
			let QueueEmbed = new MessageEmbed()

				.setColor('RANDOM')
				.setDescription(
					`[${player.queue.current.title}](${player.queue.current.uri})`
				)
				.addField('Requested by', `${player.queue.current.requester}`, true)

				.setThumbnail(player.queue.current.displayThumbnail());
			return message.channel.send(QueueEmbed);
		}

		let Songs = player.queue.map((t, index) => {
			t.index = index;
			return t;
		});

		let ChunkedSongs = _.chunk(Songs, 10); //How many songs to show per-page

		let Pages = ChunkedSongs.map(Tracks => {
			let SongsDescription = Tracks.map(
				t =>
					`\`${t.index + 1}.\` [${t.title}](${t.uri}) \n\`${prettyMilliseconds(
						t.duration,
						{
							colonNotation: true
						}
					)}\` **|** Requested by: ${t.requester}\n`
			).join('\n');

			let Embed = new MessageEmbed()
				// .setAuthor("Queue", client.config.IconURL)
				.setColor('RANDOM')
				.setDescription(
					`**Currently Playing:** \n[${player.queue.current.title}](${
						player.queue.current.uri
					}) \n\n**Up Next:** \n${SongsDescription}\n\n`
				)
				.addField('Total songs: \n', `\`${player.queue.totalSize - 1}\``, true)
				.addField(
					'Total length: \n',
					`\`${prettyMilliseconds(player.queue.duration, {
						colonNotation: true
					})}\``,
					true
				)
				.addField('Requested by:', `${player.queue.current.requester}`, true)

				.setThumbnail(player.queue.current.displayThumbnail());

			return Embed;
		});

		if (!Pages.length || Pages.length === 1)
			return message.channel.send(Pages[0]);
		else Pagination(message, Pages);
	}
};
