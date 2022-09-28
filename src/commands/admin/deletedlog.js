const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');
const botSet = require('../../../schemas/botschema');


module.exports = class DeletedLogCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'deletedlog',
      aliases: [ 'dlog'],
      usage: 'deletedlog <channel mention/ID>',
      description: oneLine`
        Sets the message delete log text channel for your server. 
        Provide no channel to clear the current \`message delete log\`.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['deletedlog #bot-log']
    });
  }
 async  run(message, args) {
let db = await this.getGuild(message.guild.id);

    const messageDeleteLogId = db.message_delete_log_id;
    const oldMessageDeleteLog = message.guild.channels.cache.get(messageDeleteLogId) || '`None`';
    const embed = new MessageEmbed()
      .setTitle('Settings: `Logging`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`message delete log\` was successfully updated. ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
  await botSet.findOneAndUpdate({
    _id: message.guild.id
  },
  {
     message_delete_log_id : null,
  },
  {
    upsert: true,
  })
      return message.channel.send({embeds: [embed.addField('Message Delete Log', `${oldMessageDeleteLog} ➔ \`None\``)]});
    }

    const messageDeleteLog = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!messageDeleteLog || messageDeleteLog.type != 'text' || !messageDeleteLog.viewable) 
      return this.sendErrorMessage(message, 0, stripIndent`
        Please mention an accessible text channel or provide a valid text channel ID
      `);
  await botSet.findOneAndUpdate({
    _id:message.guild.id
  },
  {
    message_delete_log_id: messageDeleteLog.id
  },
  {
  upsert: true,
  }
)
    message.channel.send({embeds: [embed.addField('Message Delete Log', `${oldMessageDeleteLog} ➔ ${messageDeleteLog}`)]});
  }
};
