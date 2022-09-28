const Command = require('../Command');
const { MessageEmbed } = require('discord.js');
const { TrackUtils } = require('erela.js');

module.exports = class SkipCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skip',
      aliases: ['next'],
      description: 'Skips the current song',
      type: client.types.MUSIC
    });
  }


  async run(message) {
    let player = await message.client.Manager.get(message.guild.id);

    if (!player) return message.channel.send('**No songs playing to skip**');

    if (!message.member.voice.channel)
      return message.channel.send(
        '**You must be in a voice channel to use this command!**'
      );

    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return message.channel.send(
        ' **You must be in the same voice channel as me to use this command!**'
      );
    player.stop();
  }
};