const Command = require('../Command');
const { MessageEmbed } = require('discord.js');

module.exports = class AddRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'addrole',
      aliases: ['giverole', 'addr', 'ar'],
      usage: 'addrole <user mention/ID> <role mention/ID> ',
      description: 'Adds the specified role to the provided user.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      examples: ['addrole @Noone @Member']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, "**Missing User:** Please specify the member to add the role to")
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'You cannot add a role to someone with an equal or higher role');

    const role = this.getRoleFromMention(message, args[1]) || message.guild.roles.cache.get(args[1]);
    
    
    if (!role)
      return this.sendErrorMessage(message, 0, "**Missing Role:** Please specify the role to be added to the user");
    else if (member.roles.cache.has(role.id)) // If member already has role
      return this.sendErrorMessage(message, 0, 'User already has the provided role');
    else {
      try {
        // Add role
        await member.roles.add(role);
    message.channel.send(`**${role} has been given to ${member} successfully**`)
        // Update mod log
      } catch (err) {
        message.client.logger.error(err.stack);
        return this.sendErrorMessage(message, 1, 'Please check the role hierarchy', err.message);
      }
    }  
  }
};