const Command = require('../Command');
const { MessageEmbed } = require('discord.js');

module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'kick',
      usage: 'kick <user mention/ID> [reason]',
      description: 'Kicks a member from your server.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'KICK_MEMBERS'],
      userPermissions: ['KICK_MEMBERS'],
      examples: ['kick @Shadow']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Please mention a user or provide a valid user ID');
    if (member === message.member)
      return this.sendErrorMessage(message, 0, 'You cannot kick yourself');
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'You cannot kick someone with an equal or higher role');
    if (!member.kickable)
      return this.sendErrorMessage(message, 0, 'Provided member is not kickable');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = null;
    if (reason && reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    await member.kick(reason);
const value = this.client.utils.embedColor(message.guild.id)

    const embed = new MessageEmbed()
  try{
    message.user.send(`**You have been kicked from ${message.guild.name} ${reason ? ` for ${reason}`: ''} by ${message.author.tag}`)
  }catch(err){
    embed.setFooter("Unable to Dm")
  }
  embed
     .setAuthor("Kicked!")
     .setDescription(`${member.user.tag} has been kicked from the server ${ reason ? `for ${reason}` : ''}`)
     .setColor(value ? "RANDOM" : message.guild.me.displayHexColor)
    message.channel.send({ embeds: [embed] });
    message.client.logger.log(`${message.guild.name}: ${message.author.tag} kicked ${member.user.tag}`);

    // Update mod log
    const stuff = this.setCase(message)
    if(stuff[1]){
      embed
      .setAuthor("Action: Kicked")
      .setDescription(`${member} (${member.user.tag} was kicked!`)
      .setThumbnail(member.user.displayAvatarURL({dynamic : true }))
      .addField("Kicked by:", message.member)
      .setColor("#FF1744")
      .setFooter(`Case #${stuff[0]}`)
      stuff[0].send({ embeds: [embed]})
    }
  }
}; 