const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');
const botset = require('../../../schemas/botschema');

module.exports = class ModLogsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'modlogs',
      aliases: ['mlog'],
      usage: 'modlogs <channel mention/ID>',
      description: oneLine`
        Sets the mod log text channel for your server. 
        Provide no channel to clear the current \`mod log\`.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['modlogs #mod-log']
    });
  }
  async run(message, args) {
    let db = await this.getGuild(message.guild.id);
    const modLogId = db.mod_log_id;
    const oldModLog = message.guild.channels.cache.get(modLogId) || '`None`';
    const embed = new MessageEmbed()
      .setTitle('Settings: `Logging`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`mod log\` was successfully updated. ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      await botset.findOneAndUpdate({
    _id: message.guild.id
  },
  {
    mod_log_id: null,
  },
  {
    upsert: true
  }
  )
      return message.channel.send(embed.addField('Mod Log', `${oldModLog} ➔ \`None\``));
    }

    const modLog = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!modLog || modLog.type != 'text' || !modLog.viewable) 
      return this.sendErrorMessage(message, 0, stripIndent`
        Please mention an accessible text channel or provide a valid text channel ID
      `);
    await botset.findOneAndUpdate({
    _id: message.guild.id
  },
  {
    mod_log_id: modLog.id,
  },
  {
    upsert: true
  }
  )
    message.channel.send(embed.addField('Mod Log', `${oldModLog} ➔ ${modLog}`));
  }
};
