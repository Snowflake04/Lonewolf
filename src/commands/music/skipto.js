const Command = require('../Command');
const { MessageEmbed } = require('discord.js');
const { TrackUtils, Player } = require('erela.js');

module.exports = class SkipToCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'skipto',
      aliases: ['moveto'],
      description: 'Skips to the specified song in the queue',
      type: client.types.MUSIC
    });
  }


  async run(message, args) {
    const player = message.client.Manager.create({
      guild: message.guild.id,
      voiceChannel: message.member.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: false
    });

    if (!player)
      return message.channel.send('**First add some songs dummy ;-;***');

    if (!message.member.voice.channel)
      return message.channel.send(
        '** Please join a voice channel to use this command**'
      );

    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return message.channel.send(
        ' **You must be in the same voice channel as me to use this command!**'
      );

    try {
      if (!args[0])
        return message.channel.send(
          'please provide the track no. to skip to...'
        );
      //if the wished track is bigger then the Queue Size
      if (Number(args[0]) > player.queue.size)
        return message.channel.send(
          `There are not that much songs in queue. Choose between 1 and ${
						player.queue.size
					}`
        );
      //remove all tracks to the jumped song
      player.queue.remove(0, Number(args[0]) - 1);
      //stop the player
      player.stop();
      //Send Success Message
      return message.channel.send(
        `Successfully Skipped \`${Number(args[0] - 1)}\` songs`
      );
    } catch (e) {
      console.log(String(e.stack).bgRed);
      message.channel.send('Something went wrong.');
    }
  }
};