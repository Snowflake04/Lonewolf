const Command = require('../Command');
const { MessageEmbed } = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class SlowmodeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'slowmode',
      aliases: ['slow', 'sm'],
      usage: 'slowmode [channel mention/ID] <rate> [reason]',
      description: oneLine`
        Enables slowmode in a channel with the specified rate.
        If no channel is provided, then slowmode will affect the current channel.
        Provide a rate of 0 to disable.
      `,
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_CHANNELS'],
      userPermissions: ['MANAGE_CHANNELS'],
      examples: ['slowmode #general 2', 'slowmode 3']
    });
  }
  async run(message, args) {
    let index = 1;
    let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!channel) {
      channel = message.channel;
      index--;
    }

    // Check type and viewable
    if (channel.type != 'text' || !channel.viewable) return this.sendErrorMessage(message, 0, stripIndent`
      Please mention an accessible text channel or provide a valid text channel ID
    `);
      
    const rate = args[index];
    if (!rate || rate < 0 || rate > 59) return this.sendErrorMessage(message, 0, stripIndent`
      Please provide a rate limit between 0 and 59 seconds
    `);

    // Check channel permissions
    if (!channel.permissionsFor(message.guild.me).has(['MANAGE_CHANNELS']))
      return this.sendErrorMessage(message, 0, 'I do not have permission to manage the provided channel');

     let reason = args.slice(index + 1).join(' ');

    if (!reason) reason = null;

    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';
    const value = this.client.utils.embedColor(message.guild.id)
    await channel.setRateLimitPerUser(rate, reason); // set channel rate
    const status = (channel.rateLimitPerUser) ? 'enabled' : 'disabled';
    const embed = new MessageEmbed()
      .setTitle('Slowmode')
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(value ? "RANDOM" : message.guild.me.displayHexColor);

    // Slowmode disabled
    if (rate === '0') {
     embed
        .setDescription(`Slowmode has been **disabled**`)
        if(reason){
          embed.addField('Reason', reason)
        }
        message.channel.send({embeds: [embed]})
        }
      
      // Slowmode enabled
     else {

      embed
        .setDescription(`Slowmode has been successfully set to ${rate} `)
       if(reason) embed.addField('Reason', reason)
       message.channel.send({embeds: [embed]})
    }

    // Update mod log
   let s = this.setCase(message)
   if(s[1]){
     embed
     .setAuthor("Slowmode update", message.guild.me.iconURL())
     .setDescription(`Slowmode for ${channel}
     updated!`)
     .addField("Slowmode", rate)
     .addField("Updated by:", message.member)
     .setFooter(`Case #${s[0]}`)
     .setColor("#FAFA33")
     s[1].send({ embeds: [embed]})
   }
  }
};
