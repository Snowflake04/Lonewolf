const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine } = require('common-tags');
const botSet = require('../../../schemas/botschema');


module.exports = class AutoKickCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'autokick',
      aliases: ['setak', 'sak'],
      usage: 'autokick <warn count>',
      description: oneLine`
        Sets the amount of warns needed before bot will automatically kick someone from your server.
        Provide no warn count or a warn count of 0 to disable \`auto kick\`.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['autokick 3']
    });
  }
 async run(message, args) {
    
    let db = await this.getGuild(message.guild.id)
   const autoKick = db.auto_kick || 'disabled';
    const amount = args[0];
    if (amount && (!Number.isInteger(Number(amount)) || amount < 0)) 
      return this.sendErrorMessage(message, 0, 'Please enter a positive integer');
      
    const embed = new MessageEmbed()
      .setTitle('Settings: `System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`\`Auto kick\` was successfully updated. ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0 || amount === 0) {
      await botSet.findOneAndUpdate({
        _id:message.guild.id
      },
      {
        auto_kick: null,
      },
      {
        upsert: true,
      })
      return message.channel.send({ embeds: [embed.addField('Auto Kick', `\`${autoKick}\` ➔ \`disabled\``)]});
    }

  await botSet.findOneAndUpdate({
    _id: message.guild.id
  },
  {
    auto_kick: amount
  },
  {
    upsert: true,
  })
    message.channel.send({embeds: [embed.addField('Auto Kick', `\`${autoKick}\` ➔ \`${amount}\``)]});
    
  }
};
