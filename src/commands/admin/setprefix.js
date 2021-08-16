
const Command = require('../Command.js');
const botSet = require('../../../schemas/botschema')
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const util = require('../../utils')
module.exports = class SetPrefixCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'setprefix',
      aliases: ['setp', 'sp'],
      usage: 'setprefix <prefix>',
      description: 'Sets the command `prefix` for your server. The max `prefix` length is 3 characters.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['setprefix !']
    });
  }
  async run(message, args) {
  let db = await this.getGuild(message.guild.id);
    const prefix = args[0];
    if (!prefix) return this.sendErrorMessage(message, 0, 'Please provide a prefix');
    else if (prefix.length > 3) 
      return this.sendErrorMessage(message, 0, 'Please ensure the prefix is no larger than 3 characters');
    const oldPrefix = db.prefix;
    
/*await botSet.findOneAndUpdate(
          {
          _id: message.guild.id,
          },
          {
            prefix: prefix
          },
          {
            upsert: true,
          }
        );
        */
     await util.setprefix(message.guild.id, prefix)
    const embed = new MessageEmbed()
      .setTitle('Settings: `System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`prefix\` was successfully updated. ${success}`)
      .addField('Prefix', `\`${oldPrefix}\` ➔ \`${prefix}\``)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send(embed);
  }
};
