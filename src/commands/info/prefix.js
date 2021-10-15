const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const util = require('../../utils')
module.exports = class PrefixCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'prefix',
      aliases: ['pre'],
      usage: 'prefix',
      description: 'Fetches LoneWolf\'s current prefix.',
      type: client.types.INFO
    });
  }
  async run(message) {
    
   let prefix = await util.getprefix(message.guild.id);
       const embed = new MessageEmbed()
      .setTitle('Lonewolf\'s Prefix')
      .setThumbnail('https://i.imgur.com/sqhfR5J.jpg')
      .addField('Prefix', `\`${prefix}\``, true)
      .addField('Example', `\`${prefix}ping\``, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send({ embeds: [embed] } );
  }
};
