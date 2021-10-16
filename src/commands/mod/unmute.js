const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

module.exports = class UnmuteCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unmute',
      usage: 'unmute <user mention/ID> [reason]',
      description: 'Unmutes the specified user.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      examples: ['unmute @Appuaka']
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
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'You cannot unmute someone with an equal or higher role');

    let reason = args.slice(2).join(' ');
    if (!reason) reason = null;
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    if (!member.roles.cache.has(muteRoleId))
      return this.sendErrorMessage(message, 0, 'Provided member is not muted');

    // Unmute member
    message.client.clearTimeout(member.timeout);
    const value = this.client.utils.embedColor(message.guild)
    try {
      await member.roles.remove(muteRole);
      const embed = new MessageEmbed()
        .setAuthor('Unmuted')
        .setDescription(`${member} has been unmuted ${reason ? `for ${reason}`: ''}.`)
        .setTimestamp()
        .setColor(value ? "RANDOM" : message.guild.me.displayHexColor);
      message.channel.send({ embeds: [embed] });
    } catch (err) {
      message.client.logger.error(err.stack);
      return this.sendErrorMessage(message, 1, 'Please check the role hierarchy', err.message);
    }

    // Update mod log
    let s = this.setCase(message)
    if (s[1]) {
      embed
        .setAuthor("Member unmuted", message.guild.iconURL())
        .setDescription(`${member} was unmuted`)
        .setFooter(`Case #${s[0]}`)
        .addField("Unmuted by:", message.member)
      if (reason) embed.addField("Reason", reason)
        .setColor("#7DF9FF")
      s[1].send({ embeds: [embed] })
    }
  }
};