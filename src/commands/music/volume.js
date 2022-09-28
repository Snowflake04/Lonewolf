const Command = require('../Command');
const { MessageEmbed } = require('discord.js');
const { TrackUtils } = require('erela.js');

module.exports = class VolumeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'volume',
      aliases: ['vol'],
      description: 'Sets the volume to the defined value',
      type: client.types.MUSIC
    });
  }


  async run(message, args) {
    let player = await message.client.Manager.get(message.guild.id);

    if (!player) return message.channel.send('**There\'s nothing palying...!**');

    if (!args[0])
      return message.channel.send(
        `🔉 | Current volume is \`${player.volume}\`.`
      );

    if (!message.member.voice.channel)
      return message.channel.send('**You have to be in a voice channel !**');

    if (
      message.guild.me.voice.channel &&
      message.member.voice.channel.id !== message.guild.me.voice.channel.id
    )
      return message.channel.send(
        ':x: | **You must be in the same voice channel as me to use this command!**'
      );

    if (!parseInt(args[0]))
      return message.channel.send(
        `**Please choose a number between** \`1 - 100\``
      );

    if (parseInt(args[0]) > 100)
      return message.channel.send('**You Wannabe Deaf? ;-;**');
    let vol = parseInt(args[0]);
    player.setVolume(vol);

    message.channel.send(`🔉 | **Volume successfully set to** \`${player.volume}\``);
  }
};