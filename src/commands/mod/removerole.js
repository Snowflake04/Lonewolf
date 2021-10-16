const Command = require('../Command');
const { MessageEmbed } = require('discord.js');

module.exports = class RemoveRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'removerole',
      aliases: ['remover', 'rr'],
      usage: 'removerole <user mention/ID> <role mention/ID> ',
      description: 'Removes the specified role from the provided user.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_ROLES'],
      userPermissions: ['MANAGE_ROLES'],
      examples: ['removerole @Shadow @Mod']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Please mention a user or provide a valid user ID');
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'You cannot remove a role from someone with an equal or higher role');

    const role = this.getRoleFromMention(message, args[1]) || message.guild.roles.cache.get(args[1]);


    if (!role)
      return this.sendErrorMessage(message, 0, 'Please mention a role or provide a valid role ID');
    else if (!member.roles.cache.has(role.id)) // If member doesn't have role
      return this.sendErrorMessage(message, 0, 'User does not have the provided role');
    else {
      try {

        // Add role

        await member.roles.remove(role);
        const value = this.client.utils.embedColor(message.guild.id)
        const embed = new MessageEmbed()
          .setAuthor('Role Removed')
          .setDescription(`${role} has been successfully removed from ${member}.`)
          .setTimestamp()
          .setColor(value ? "RANDOM" : message.guild.me.displayHexColor);
        message.channel.send({ embeds: [embed] });

        // Update mod log
        let s = this.setCase(message)
        if (s[1]) {
          embed
            .setAuthor("Role Removed", member.user.displayAvatarURL({ dynamic: true}))
            .setDescription(`${member} removed from ${role}`)
            .addField("Removed by :", message.member)
            .setColor("#009E60")
            .setFooter(`Case #${s[0]}`)
            .setThumbnail(message.guild.iconURL())
          s[1].send({ embeds: [embed] })
        }

      } catch (err) {
        message.client.logger.error(err.stack);
        this.sendErrorMessage(message, 1, 'Please check the role hierarchy', err.message);
      }
    }
  }
};