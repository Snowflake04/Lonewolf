const Command = require('../Command');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');

module.exports = class SoftBanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'softban',
      usage: 'softban <user mention/ID> [reason]',
      description: oneLine `
        Softbans a member from your server (bans then immediately unbans).
        This wipes all messages from that member from your server.      
      `,
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      examples: ['softban @Shadow']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Please mention a user or provide a valid user ID');
    if (member === message.member)
      return this.sendErrorMessage(message, 0, 'You cannot softban yourself');
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'You cannot softban someone with an equal or higher role');
    if (!member.bannable)
      return this.sendErrorMessage(message, 0, 'Provided member is not bannable');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = null;
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    await member.ban({ reason: reason });
    await message.guild.members.unban(member.user, reason);
    const value = this.client.utils.embedColor(message.guild.id)
    const embed = new MessageEmbed()
    try{
      member.user.send(`You have been kicked from **${message.guild.name}** ${reason ? `for **${reason}**` : ''} by ${message.author.tag}`)
    }catch(err){
      embed.setFooter("unable to dm")
    }
    embed
      .setAuthor('Softbanned')
      .setDescription(`${member.user.tag} has been successfully softbanned ${reason ? `for ${reason}`: ''}`)
      .setTimestamp()
      .setColor(value ? "RANDOM" : message.guild.me.displayHexColor);
    message.channel.send({ embeds: [embed] });
    message.client.logger.log(`${message.guild.name}: ${message.author.tag} softbanned ${member.user.tag}`);

    // Update mod log
    let s = this.setCase(message)
    if (s[1]) {
      embed
        .setDescription(`${member} (${member.user.tag} ) was softbanned`)
        .addField("Banned by:", message.member)
      if (reason) embed.addField("Reason:", reason)
        .setColor("#EE4B2B")
        .setFooter(`Case #${s[0]}`)
      s[1].send({ embeds: [embed] })
    }
  }
};