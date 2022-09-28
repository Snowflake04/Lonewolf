const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine } = require('common-tags');
const botset = require('../../../schemas/botschema');

module.exports = class WelcomeMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'welcomemessage',
      aliases: ['welcomemsg' ],
      usage: 'welcomemessage <message>',
      description: oneLine`
        Sets the message bot will say when someone joins your server.
        You may use \`?member\` to substitute for a user mention,
        \`?username\` to substitute for someone's username,
        \`?tag\` to substitute for someone's full Discord tag (username + discriminator),
        and \`?size\` to substitute for your server's current member count.
        Enter no message to clear the current \`welcome message\`.
        A \`welcome channel\` must also be set to enable welcome messages.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['welcomemessage ?member has joined the server!']
    });
  }
 async run(message, args) {
let db = await this.getGuild(message.guild.id);
    const welcomeChannelId = db.welcome_channel_id;
   const oldWelcomeMessage = db.welcome_message; 
    let welcomeChannel = message.guild.channels.cache.get(welcomeChannelId);

    // Get status
    const oldStatus = message.client.utils.getStatus(welcomeChannelId, oldWelcomeMessage);

    const embed = new MessageEmbed()
      .setTitle('Settings: `Welcomes`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`welcome message\` was successfully updated. ${success}`)
      .addField('Channel', welcomeChannel || '`None`', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (!args[0]) {
      await botset.findOneAndUpdate({
    _id: message.guild.id
  },
  {
   welcome_message: null,
  },
  {
    upsert: true
  }
  )

      // Update status
      const status = 'disabled';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 

      return message.channel.send(embed
        .addField('Status', statusUpdate, true)
        .addField('Message', '`None`')
      );
    }
    
    let welcomeMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    await botset.findOneAndUpdate({
    _id: message.guild.id
  },
  {
   welcome_message: welcomeMessage
  },
  {
    upsert: true
  }
  )
    if (welcomeMessage.length > 1024) welcomeMessage = welcomeMessage.slice(0, 1021) + '...';

    // Update status
    const status =  message.client.utils.getStatus(welcomeChannel, welcomeMessage);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;

    message.channel.send(embed
      .addField('Status', statusUpdate, true)
      .addField('Message', message.client.utils.replaceKeywords(welcomeMessage))
    );
  }
};