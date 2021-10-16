const Command = require('../Command');
const { MessageEmbed } = require('discord.js');

module.exports = class AvatarCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'avatar',
      aliases: ['profilepic', 'pic', 'ava'],
      usage: 'avatar [user mention/ID]',
      description: 'Displays a user\'s avatar (or your own, if no user is mentioned).',
      type: client.types.INFO,
      examples: ['avatar @shadow']
    });
  }
  run(message, args) {
    const member = this.getMemberFromMention(message, args[0]) ||
      message.guild.members.cache.get(args[0]) ||
      message.member;
    const value = this.client.utils.embedColor(message.guild.id)
    const embed = new MessageEmbed()
      .setTitle(`${member.displayName}'s Avatar`)
      .setImage(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(value ? "RANDOM" : member.displayHexColor);
    message.channel.send({ embeds: [embed] });
  }
};