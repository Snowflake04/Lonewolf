const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const botSet = require('../../../schemas/botschema');

module.exports = class AdminRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'adminrole',
      aliases: ['setar', 'sar'],
      usage: 'adminrole <role mention/ID>',
      description: 'Sets the `admin role` for your server. Provide no role to clear the current `admin role`.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['adminrole @Admin']
    });
  }
 async run(message, args) {
 let db = await this.getGuild(message.guild.id);
    const adminRoleId = db.admin_role_id;
    const oldAdminRole = message.guild.roles.cache.find(r => r.id === adminRoleId) || '`None`';

    const embed = new MessageEmbed()
      .setTitle('Settings: `System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`admin role\` was successfully updated. ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
     
     await botSet.findOneAndUpdate({
       _id: message.guild.id
     },
     {
       admin_role_id: null,
     }
    );
     
   return message.channel.send({ embeds: [embed.addField('Admin Role', `${oldAdminRole} ➔ \`None\``)]});
    }

    // Update role
    const adminRole = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!adminRole) return this.sendErrorMessage(message, 0, 'Please mention a role or provide a valid role ID');
  await botSet.findOneAndUpdate({
    _id: message.guild.id
  },
  {
    admin_role_id: adminRole.id,
  });
  
    message.channel.send({embeds: [embed.addField('Admin Role', `${oldAdminRole} ➔ ${adminRole}`)]});
    
  }
};
