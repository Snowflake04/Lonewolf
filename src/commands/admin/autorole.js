const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const { oneLine } = require('common-tags');
const botSet = require('../../../schemas/botschema');


module.exports = class AutoRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'autorole',
      aliases: ['arole' ],
      usage: 'autorole <role mention/ID>',
      description: oneLine`
        Sets the role all new members will receive upon joining your server.
        Provide no role to clear the current \`auto role\`.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['autorole @Member']
    });
  }
  async run(message, args) {
   let db = await this.getGuild(message.guild.id);
    const autoRoleId = db.auto_role_id;
    const oldAutoRole = message.guild.roles.cache.find(r => r.id === autoRoleId) || '`None`';

    const embed = new MessageEmbed()
      .setTitle('Settings: `System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`auto role\` was successfully updated. ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
   await botSet.findOneAndUpdate({
     _id: message.guild.id
   },
   {
     auto_role_id: null,
   },
   {
     upsert: true,
   })
      return message.channel.send(embed.addField('Auto Role', `${oldAutoRole} ➔ \`None\``));
    }

    // Update role
    const autoRole = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!autoRole) return this.sendErrorMessage(message, 0, 'Please mention a role or provide a valid role ID');
  await botSet.findOneAndUpdate({
    _id:message.guild.id
  },
  {
    auto_role_id:autoRole.id,
  },
  {
    upsert: true,
    
  })
    message.channel.send(embed.addField('Auto Role', `${oldAutoRole} ➔ ${autoRole}`));
  }
};
