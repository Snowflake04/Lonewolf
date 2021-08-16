const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');
const botset = require('../../../schemas/botschema')

module.exports = class NickLogCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'nicklog',
      aliases: ['nicknamelog'],
      usage: 'nicklog <channel mention/ID>',
      description: oneLine`
        Sets the nickname change log text channel for your server. 
        Provide no channel to clear the current \`nickname log\`.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['nicklog #bot-log']
    });
  }
 async run(message, args) {
   let db = await this.getGuild(message.guild.id);
   const nicknameLogId = db.nickname_log_id;
    const oldNicknameLog = message.guild.channels.cache.get(nicknameLogId) || '`None`';
    
    
    const embed = new MessageEmbed()
      .setTitle('Settings: `Logging`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`nickname log\` was successfully updated. ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      await botset.findOneAndUpdate({
    _id: message.guild.id
  },
  {
    nickname_log_id: null,
  },
  {
    upsert: true
  }
  )
      return message.channel.send(embed.addField('Nickname Log', `${oldNicknameLog} ➔ \`None\``));
    }

    const nicknameLog = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (!nicknameLog || nicknameLog.type != 'text' || !nicknameLog.viewable) 
      return this.sendErrorMessage(message, 0, stripIndent`
        Please mention an accessible text channel or provide a valid text channel ID
      `);

    await botset.findOneAndUpdate({
      _id: message.guild.id
    },
    {
     nickname_log_id: nicknameLog.id
      
    },
    {
      upsert: true,
    })
    message.channel.send(embed.addField('Nickname Log', `${oldNicknameLog} ➔ ${nicknameLog}`));
  }
};