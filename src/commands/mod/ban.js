const Command = require('../Command');
const { MessageEmbed } = require('discord.js');

module.exports = class BanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'ban',
      usage: 'ban <user mention/ID> [reason]',
      description: 'Bans a member from your server.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      examples: ['ban @daddychill']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Please mention a user or provide a valid user ID');
    if (member === message.member)
      return this.sendErrorMessage(message, 0, 'You cannot ban yourself');
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'You cannot ban someone with an equal or higher role');
    if (!member.bannable)
      return this.sendErrorMessage(message, 0, 'Provided member is not bannable');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = null;
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    await member.ban({ reason: reason });
    const embed = new MessageEmbed()
      .setAuthor('Banned!')
    try {
      await message.user.send(`**You have been banned on ${message.guild.name} ${reason ? `for ${reason}` : ''} by ${message.author.tag}**`)
    } catch (err) {
      embed.setFooter("Unable to dm");
    }
    let value = this.client.utils.embedColor(message.guild.id)
    embed
      .setDescription(`${member.user.tag} has been banned ${reason ? `for **${reason}**` : '' }`)
      .setColor(value ? "RANDOM" : message.guild.me.displayHexColor)
      .setTimestamp()
    message.channel.send({ embeds: [embed] });
    message.client.logger.log(`${message.guild.name}: ${message.author.tag} banned ${member.user.tag}`);

    // Update mod log
    let need = this.setCase(message)
    if (need[1]) {
      embed
        .setAuthor("Ban")
        .setDescription(`${member.user.tag} was banned`)
        .setColor("RED")
        .setThumbnail(member.user.displayAvatarURL({ dynamic : true }))
        .addField("Banned by:", message.member)
      if (reason) embed.addField("Reason:", reason)
        .setFooter(`Case ${need[0]}`)
      need[1].send({ embeds: [embed] })
    }
  }
};