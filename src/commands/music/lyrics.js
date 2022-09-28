const Command = require('../Command');
const { MessageEmbed } = require('discord.js');
const { TrackUtils } = require('erela.js');
const lyricsFinder = require('lyrics-finder');
const _ = require('lodash');
const Pagination = require('../pagination');

module.exports = class LyricsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lyrics',
      aliases: ['ly'],
      description: 'Fetches the lyrics of the song',
      type: client.types.MUSIC
    });
  }


  async run(message, args) {
    let player = await message.client.Manager.get(message.guild.id);

    let SongTitle = args.join(' ');

    let SearchString = args.join(' ');

    if (!args[0] && !player)
      return message.channel.send('**No song is playing right now...**');

    if (!args[0]) SongTitle = player.queue.current.title;

    let lyrics = await lyricsFinder(SongTitle);

    if (!lyrics)
      return message.channel.send(`**No lyrics found for -** \`${SongTitle}\``);

    lyrics = lyrics.split('\n'); //spliting into lines

    let SplitedLyrics = _.chunk(lyrics, 40); //45 lines each page

    let Pages = SplitedLyrics.map(ly => {
      let em = new MessageEmbed()
        // .setAuthor(`Lyrics for: ${SongTitle}`, client.config.IconURL)
        .setColor('RANDOM')
        .setDescription(ly.join('\n'));

      if (args.join(' ') !== SongTitle)
        em.setThumbnail(player.queue.current.displayThumbnail());

      return em;
    });

    if (!Pages.length || Pages.length === 1)
      return message.channel.send({ embeds: [Pages[0]] });
    else return Pagination(message, Pages);
  }
};