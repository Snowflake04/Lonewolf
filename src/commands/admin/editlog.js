const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');
const botSet = require('../../../schemas/botschema');


module.exports = class EditLogCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'editlog',
      aliases: ['eml'],
      usage: 'editlog <channel mention/ID>',
      description: oneLine`
        Sets the message edit log text channel for your server. 
        Provide no channel to clear the current \`message edit log\`.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['editlog #bot-log']
    });
  }
 async run(message, args) {
   
   let db = await this.getGuild(message.guild.id);
    const messageEditLogId = db.message_edit_log_id;
    const oldMessageEditLog = message.guild.channels.cache.get(messageEditLogId) || '`None`';
    const embed = new MessageEmbed()
      .setTitle('Settings: `Logging`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`message edit log\` was successfully updated. ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
   await botSet.findOneAndUpdate({
     _id: message.guild.id
   },
   {
     message_edit_log_id: null,
   },
   {
     upsert: true,
   })
      return message.channel.send(embed.addField('Message Edit Log', `${oldMessageEditLog} ➔ \`None\``));
    }

    const messageEditLog = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!messageEditLog || messageEditLog.type != 'text' || !messageEditLog.viewable) 
      return this.sendErrorMessage(message, 0, stripIndent`
        Please mention an accessible text channel or provide a valid text channel ID
      `);
  await botSet.findOneAndUpdate({
    _id:message.guild.id
  },
  {
    message_edit_log_id: messageEditLog.id,
  },
  {
    upsert:true,
  })
    message.channel.send(embed.addField('Message Edit Log', `${oldMessageEditLog} ➔ ${messageEditLog}`));
  }
};
