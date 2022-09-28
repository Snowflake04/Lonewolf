const Command = require('../Command');
const { MessageEmbed } = require('discord.js');

module.exports = class ShuffleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'shuffle',
      aliases: ['juggle'],
      description: 'Shuffles the songs in the Queue',
      type: client.types.MUSIC
    });
  }


  async run(message) {
    let player = await message.client.Manager.get(message.guild.id);
    if (!player) return message.channel.send('**Nothing playing to shuffle**');

    if (!message.member.voice.channel)
      return message.channel.send(
        '**Join a voice channel before using the command!**'
      );

    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return message.channel.send(
        '**Oops | You must be in the same voice channel as me to use this command!**'
      );

    if (!player.queue || !player.queue.length || player.queue.length === 0)
      return message.channel.send(
        '**OOPS! Not enough songs in queue to shuffle**'
      );
    player.queue.shuffle();
    await message.channel.send('Successfully Shuffled the queue! ');
  }
};