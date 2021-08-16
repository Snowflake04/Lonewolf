const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');
const botset = require('../../../schemas/botschema');

module.exports = class RoleLogCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'rolelog',
      aliases: ['setrolelog'],
      usage: 'rolelog <channel mention/ID>',
      description: oneLine`
        Sets the role change log text channel for your server. 
        Provide no channel to clear the current \`role log\`.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['rolelog #bot-log']
    });
  }
 async run(message, args) {
    let db = await this.getGuild(message.guild.id);
    const roleLogId = db.role_log_id;
    const oldRoleLog = message.guild.channels.cache.get(roleLogId) || '`None`';
    const embed = new MessageEmbed()
      .setTitle('Settings: `Logging`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`role log\` was successfully updated. ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      await botset.findOneAndUpdate({
    _id: message.guild.id
  },
  {
    role_log_id: null,
  },
  {
    upsert: true
  }
  )
      return message.channel.send(embed.addField('Role Log', `${oldRoleLog} ➔ \`None\``));
    }

    const roleLog = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!roleLog || roleLog.type != 'text' || !roleLog.viewable) 
      return this.sendErrorMessage(message, 0, stripIndent`
        Please mention an accessible text channel or provide a valid text channel ID
      `);
    await botset.findOneAndUpdate({
    _id: message.guild.id
  },
  {
    role_log_id: roleLog.id,
  },
  {
    upsert: true
  }
  )
    message.channel.send(embed.addField('Role Log', `${oldRoleLog} ➔ ${roleLog}`));
  }
};
