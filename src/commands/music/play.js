const Command = require('../Command');
const { Util, MessageEmbed } = require('discord.js');
const { TrackUtils, Player } = require('erela.js');
const prettyMilliseconds = require('pretty-ms');
const util = require('../../utils/utils');
const config = require('../../../config');
module.exports = class PlayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'play',
      aliases: ['p'],
      usage: 'play <song_name>',
      description: 'Fetches the lyrics of the song',
      example: ['play History'],
      type: client.types.MUSIC
    });
  }


  async run(message, args) {
    let prefix = await util.getprefix(message.guild.id);
    if (!message.member.voice.channel)
      return message.channel.send('**Please join a voice channel first!**');

    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return message.channel.send(
        '**Oops** | **You must be in the same voice channel as me to use this command!**'
      );

    let SearchString = args.join(' ');

    if (!SearchString)
      return message.channel.send(`**Please provide a song to play. ${prefix}play [sog_name]**`);

    let Searching = await message.channel.send('**Loading!...**');

    const player = message.client.Manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: true
    });

    let SongAddedEmbed = new MessageEmbed().setColor('RANDOM');


    if (player.state != 'CONNECTED') await player.connect();

    try {
      if (SearchString.match(message.client.Lavasfy.spotifyPattern)) {
        await message.client.Lavasfy.requestToken();
        let node = message.client.Lavasfy.nodes.get(player.node.options.host);
        let Searched = await node.load(SearchString);

        if (Searched.loadType === 'PLAYLIST_LOADED') {
          let songs = [];
          for (let i = 0; i < Searched.tracks.length; i++)
            songs.push(TrackUtils.build(Searched.tracks[i], message.author));
          player.queue.add(songs);
          if (
            !player.playing &&
            !player.paused &&
            player.queue.totalSize === Searched.tracks.length
          )
            player.play();

          SongAddedEmbed.setAuthor(
            `Playlist added to queue`,
            message.author.displayAvatarURL()
          );
          SongAddedEmbed.addField(
            'Enqueued',
            `\`${Searched.tracks.length}\` songs`,
            false
          );
  
          Searching.edit({ embeds: [SongAddedEmbed] });
        } else if (Searched.loadType.startsWith('TRACK')) {
          player.queue.add(
            TrackUtils.build(Searched.tracks[0], message.author)
          );
          if (!player.playing && !player.paused && !player.queue.size)
            player.play();
  

          SongAddedEmbed.setDescription(
            `[${Searched.tracks[0].info.title}](${Searched.tracks[0].info.uri})`
          );

          SongAddedEmbed.addField(
            'Author',
            Searched.tracks[0].info.author,
            true
          );

          if (player.queue.totalSize > 1)
            SongAddedEmbed.addField(
              'Position in queue',
              `${player.queue.size - 0}`,
              true
            );
          Searching.edit({ embeds: [SongAddedEmbed] });
        } else {
          return message.channel.send(
            '**No matches found for - **' + SearchString
          );
        }
      } else {
        let Searched = await player.search(SearchString, message.author);
        if (!player)
          return message.channel.send(
            '❌ | **Nothing is playing right now...**'
          );

        if (Searched.loadType === 'NO_MATCHES')
          return message.channel.send(
            '**No matches found for - **' + SearchString
          );
        else if (Searched.loadType == 'PLAYLIST_LOADED') {
          player.queue.add(Searched.tracks);
          if (
            !player.playing &&
            !player.paused &&
            player.queue.totalSize === Searched.tracks.length
          )
            player.play();

          SongAddedEmbed.setThumbnail(Searched.tracks[0].displayThumbnail());
          SongAddedEmbed.setDescription(
            `[${Searched.playlist.name}](${SearchString})`
          );
          SongAddedEmbed.addField(
            'Enqueued',
            `\`${Searched.tracks.length}\` songs`,
            false
          );
          SongAddedEmbed.addField(
            'Playlist duration',
            `\`${prettyMilliseconds(Searched.playlist.duration, {
							colonNotation: true
						})}\``,
            false
          );
          Searching.edit({ embeds: [SongAddedEmbed] });
        } else {
          player.queue.add(Searched.tracks[0]);
          if (!player.playing && !player.paused && !player.queue.size)
            player.play();

          if (player.queue.totalSize > 1) {
            SongAddedEmbed.setThumbnail(Searched.tracks[0].displayThumbnail());
            SongAddedEmbed.setDescription(
              `[${Searched.tracks[0].title}](${Searched.tracks[0].uri})`
            );
            SongAddedEmbed.addField('Author', Searched.tracks[0].author, true);
            SongAddedEmbed.addField(
              'Duration',
              `\`${prettyMilliseconds(Searched.tracks[0].duration, {
								colonNotation: true
							})}\``,
              true
            );
            SongAddedEmbed.addField(
              'Position in queue',
              `${player.queue.size - 0}`,
              true
            );
            Searching.edit('\u200b', { embed: SongAddedEmbed });
          }
        }
      }
    } catch (e) {
      console.log(e);
      return message.channel.send('**No matches found for - **' + SearchString);
    }
  }
};