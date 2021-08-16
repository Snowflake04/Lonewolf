const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine } = require('common-tags');
const botSet = require('../../../schemas/botschema');

module.exports = class FarewellMessageCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'farewellmessage',
      aliases: ['setfwmsg' ],
      usage: 'farewellmessage <message>',
      description: oneLine`
        Sets the message bot will say when someone leaves your server.
        You may use \`?member\` to substitute for a user mention,
        \`?username\` to substitute for someone's username,
        \`?tag\` to substitute for someone's full Discord tag (username + discriminator),
        and \`?size\` to substitute for your server's current member count.
        Enter no message to clear the current \`farewell message\`.
        A \`farewell channel\` must also be set to enable farewell messages.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['farewellmessage ?member has left the server.']
    });
  }
 async  run(message, args) {
let db = await this.getGuild(message.guild.id);

    const farewellChannelId = db.farewell_channel_id;
 const oldFarewellMessage = db.farewell_message;
    const farewellChannel = message.guild.channels.cache.get(farewellChannelId);
    
    // Get status
    const oldStatus = message.client.utils.getStatus(farewellChannelId, oldFarewellMessage);

    const embed = new MessageEmbed()
      .setTitle('Settings: `Farewells`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`farewell message\` was successfully updated. ${success}`)
      .addField('Channel', farewellChannel || '`None`', true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    if (!args[0]) {
   await botSet.findOneAndUpdate({
     _id: message.guild.id
   },
   {
     farewell_message: null
   },
   {
     upsert: true,
   })

      // Update status
      const status = 'disabled';
      const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``; 

      return message.channel.send(embed
        .addField('Status', statusUpdate, true)
        .addField('Message', '`None`')
      );
    }
    
    let farewellMessage = message.content.slice(message.content.indexOf(args[0]), message.content.length);
    
     await botSet.findOneAndUpdate({
    _id: message.guild.id,
     },
    {
      farewell_message: farewellMessage
    },
    { 
      upsert: true,
  })
    if (farewellMessage.length > 1024) farewellMessage = farewellMessage.slice(0, 1021) + '...';

    // Update status
    const status =  message.client.utils.getStatus(farewellChannel, farewellMessage);
    const statusUpdate = (oldStatus != status) ? `\`${oldStatus}\` ➔ \`${status}\`` : `\`${oldStatus}\``;
    
    message.channel.send(embed
      .addField('Status', statusUpdate, true)
      .addField('Message', message.client.utils.replaceKeywords(farewellMessage))
    );
  }
};