const Command = require('../Command');
const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');
const userset = require('../../../schemas/userschema');

module.exports = class ClearWarnsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'clearwarns',
      usage: 'clearwarns <user mention/ID>',
      description: 'Clears all the warns of the provided member.',
      type: client.types.MOD,
      userPermissions: ['KICK_MEMBERS'],
      examples: ['clearwarns @Danny']
    });
  }
 async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Please mention a user or provide a valid user ID');
    if (member === message.member) 
      return this.sendErrorMessage(message, 0, 'You cannot clear your own warns'); 
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'You cannot clear the warns of someone who have an equal or higher role');

   
    
  await userset.findOneAndUpdate({
    user_id: member.id,
    guild_id: message.guild.id
  },
  {
    warns: '',
  },
    {
      upsert: true,
    })
 const value = this.client.utils.embedColor(message.guild.id)
    const embed = new MessageEmbed()
  .setAuthor("Warns cleared!")
  .setDescription(`All warnings for ${member} has been successfully cleared`)
  .setColor(value ? "RANDOM" : message.guild.me.displayHexColor)
  .setTimestamp()
    message.channel.send({ embeds: [embed] } );
    message.client.logger.log(oneLine`
      ${message.guild.name}: ${message.author.tag} cleared ${member.user.tag}'s warns
    `);
    
    // Update mod log
  let need =  this.setCase(message)
  let need = this.setCase(message)
  if (need[1]) {
    embed
      .setAuthor("Warns cleared", member.user.displayAvatarURL({ dynamic: true}))
      .setDescription(`${member}'s warnings was cleared`)
      .setThumbnail(member.user.displayAvatarURL( { dynamic: true}))
      .setColor("#7C4DFF")
      .addField("Cleared by:", message.member)
      .setFooter(`Case ${need[0]}`)
    need[1].send({ embeds: [embed] })
  }
  }
};
