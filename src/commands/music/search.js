const Command = require('../Command');
const { MessageEmbed, Message } = require('discord.js');
const { TrackUtils } = require('erela.js');
const _ = require('lodash');
const prettyMilliseconds = require('pretty-ms');
const util = require('../../utils');
const Pagination = require('../pagination');
const config = require('../../../config');

module.exports = class SearchCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'search',
			aliases: ['se'],
			usage: 'search <song_name>',
			description: 'Searches for the given song',

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
		if (!message.member.voice.channel)
			return message.channel.send('**You must join a voice channel first**');
		if (
			message.guild.me.voice.channel &&
			message.member.voice.channel.id !== message.guild.me.voice.channel.id
		)
			return message.channel.send(
				':x: | **You must be in the same voice channel as me to use this command!**'
			);
		let prefix = await util.getprefix(message.guild.id);

		let SearchString = args.join(' ');
		if (!SearchString)
			return message.channel.send(`**Usage - **\`${prefix}search [query]\``);
		const player = message.client.Manager.create({
			guild: message.guild.id,
			voiceChannel: message.member.voice.channel.id,
			textChannel: message.channel.id,
			selfDeafen: false
		});

		if (player.state != 'CONNECTED') await player.connect();

		let Searched = await player.search(SearchString, message.author);
		if (Searched.loadType == 'NO_MATCHES')
			return message.channel.send('No results found for ' + SearchString);

		Searched.tracks = Searched.tracks.map((s, i) => {
			s.index = i;
			return s;
		});
		let songs = _.chunk(Searched.tracks, 10);
		let Pages = songs.map(songz => {
			let MappedSongs = songz.map(
				s =>
					`\`${s.index + 1}.\` [${s.title}](${
						s.uri
					}) \nDuration: \`${prettyMilliseconds(s.duration, {
						colonNotation: true
					})}\``
			);

			let em = new MessageEmbed()
				// .setAuthor("Search Results of " + SearchString, client.config.IconURL)
				.setColor('RANDOM')
				.setDescription(MappedSongs.join('\n\n'));
			return em;
		});

		if (!Pages.length || Pages.length === 1)
			return message.channel.send(Pages[0]);
		else Pagination(message, Pages);

		let w = a => new Promise(r => setInterval(r, a));
		await w(500); //waits 500ms cuz needed to wait for the above song search embed to send ._.
		let msg = await message.channel.send(
			'**Select the number corresponding to your desired song.**'
		);

		let er = false;
		let SongID = await message.channel
			.awaitMessages(msg => message.author.id === msg.author.id, {
				max: 1,
				errors: ['time'],
				time: 30000
			})
			.catch(() => {
				er = true;
				msg.edit('**No input recieved ;-; !**');
			});
		if (er) return;
		/**@type {Message} */
		let SongIDmsg = SongID.first();

		if (!parseInt(SongIDmsg.content))
			return message.channel.send('Please select a number in the list');
		let Song = Searched.tracks[parseInt(SongIDmsg.content) - 1];
		if (!Song) return message.channel.send('No song found for the given ID');
		player.queue.add(Song);
		if (!player.playing && !player.paused && !player.queue.size) player.play();
		let SongAddedEmbed = new MessageEmbed();
		// SongAddedEmbed.setAuthor(`Added to queue`, client.config.IconURL);
		SongAddedEmbed.setThumbnail(Song.displayThumbnail());
		SongAddedEmbed.setColor('RANDOM');
		SongAddedEmbed.setDescription(`[${Song.title}](${Song.uri})`);
		SongAddedEmbed.addField('Author', `${Song.author}`, true);
		SongAddedEmbed.addField(
			'Duration',
			`\`${prettyMilliseconds(player.queue.current.duration, {
				colonNotation: true
			})}\``,
			true
		);
		if (player.queue.totalSize > 1)
			SongAddedEmbed.addField(
				'Position in queue',
				`${player.queue.size - 0}`,
				true
			);
		message.channel.send(SongAddedEmbed);
	}
};
