const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const ms = require('ms');

module.exports = class MuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'mute',
      usage: 'mute <user mention/ID> <time> [reason]',
      description: 'Mutes a user for the specified amount of time.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      examples: ['mute @Aqua 10s', 'mute @Aqua 30m talks too much']
    });
  }
  async run(message, args) {

    let db = await this.getGuild(message.guild.id)

    const muteRoleId = db.mute_role_id;
    let muteRole;
    if (muteRoleId) muteRole = message.guild.roles.cache.get(muteRoleId);
    else return this.sendErrorMessage(message, 1, 'There is currently no mute role set on this server');

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Please mention a user or provide a valid user ID');
    if (member === message.member)
      return this.sendErrorMessage(message, 0, 'You cannot mute yourself');
    if (member === message.guild.me) return this.sendErrorMessage(message, 0, 'You cannot mute me');
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'You cannot mute someone with an equal or higher role');
    if (!args[1])
      return this.sendErrorMessage(message, 0, 'Please enter a length of time of 14 days or less (1s/m/h/d)');
    let time = ms(args[1]);
    if (!time || time > 1296000000) // Cap at 15 days, larger than 24.8 days causes integer overflow
      return this.sendErrorMessage(message, 0, 'Please enter a length of time of 15 days or less (1s/m/h/d)');

    let reason = args.slice(2).join(' ');
    if (!reason) reason = null;
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    if (member.roles.cache.has(muteRoleId))
      return this.sendErrorMessage(message, 0, 'Provided member is already muted');

    // Mute member
    try {
      await member.roles.add(muteRole);
    } catch (err) {
      message.client.logger.error(err.stack);
      return this.sendErrorMessage(message, 1, 'Please check the role hierarchy', err.message);
    }
    const value = this.client.utils.embedColor(message.guild.id)
    const muteEmbed = new MessageEmbed()
      .setAuthor('Muted')
      .setDescription(`${member} has now been muted for **${ms(time, { long: true })}** ${reason ? `for ${reason}` : ''}.`)
      .setTimestamp()
      .setColor(value ? "RANDOM" : message.guild.me.displayHexColor);
    message.channel.send({ embeds: [muteEmbed] });

    // Unmute member
    member.timeout = message.client.setTimeout(async () => {
      try {
        await member.roles.remove(muteRole);
        embed.Author("Unmuted")
          .setDescription(`${member} has been unmuted.`)
        message.channel.send({ embeds: [unmuteEmbed] });
      } catch (err) {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 1, 'Please check the role hierarchy', err.message);
      }
    }, time);

    // Update mod log
    let s = this.setCase(message)
    if (s[1]) {
      const em = new MessageEmbed()
        .setAuthor("Action: Muted")
        .setDescription(`${member} was muted`)
        .setTimestamp()
        .setColor("#9C27B0")
        .setFooter(`Case #${s[0]}`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addField("Muted by:", message.member)
      if (reason) em.addField("Reason :", reason)
      s[1].send({ embeds: [embed] })
    }
  }
};