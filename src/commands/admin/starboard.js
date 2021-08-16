const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');
const botset = require('../../../schemas/botschema');

module.exports = class StarboardCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'starboard',
      aliases: ['starchannel'],
      usage: 'starboard <channel mention/ID>',
      description: oneLine`
        Sets the starboard text channel for your server.
        Provide no channel to clear the current \`starboard channel\`.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['starboard #starboard']
    });
  }
  async run(message, args) {
   let db = await this.getGuild(message.guild.id); 
    const starboardChannelId = db.starboard_channel_id; 
    const oldStarboardChannel = message.guild.channels.cache.get(starboardChannelId) || '`None`';
    const embed = new MessageEmbed()
      .setTitle('Settings: `Starboard`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`starboard channel\` was successfully updated. ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      await botset.findOneAndUpdate({
    _id: message.guild.id
  },
  {
   starboard_channel_id: null,
  },
  {
    upsert: true
  }
  )
      return message.channel.send(embed.addField('Starboard Channel', `${oldStarboardChannel} ➔ \`None\``));
    }

    const starboardChannel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (
      !starboardChannel || 
      (starboardChannel.type != 'text' && starboardChannel.type != 'news') || 
      !starboardChannel.viewable
    ) {
      return this.sendErrorMessage(message, 0, stripIndent`
        Please mention an accessible text or announcement channel or provide a valid text or announcement channel ID
      `);
    }
    await botset.findOneAndUpdate({
    _id: message.guild.id
  },
  {
    starboard_channel_id: starboardChannel.id,
  },
  {
    upsert: true
  }
  )
    message.channel.send(embed.addField('Starboard Channel', `${oldStarboardChannel} ➔ ${starboardChannel}`));
  }
};
