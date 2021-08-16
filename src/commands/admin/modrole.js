const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const botset = require('../../../schemas/botschema');

module.exports = class ModRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'modrole',
      aliases: ['mrole'],
      usage: 'modrole <role mention/ID>',
      description: 'Sets the `mod role` for your server. Provide no role to clear the current `mod role`.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['modrole @Mod']
    });
  }
  async run(message, args) {
    let db = await this.getGuild(message.guild.id);
    const modRoleId = db.mod_role_id
    const oldModRole = message.guild.roles.cache.find(r => r.id === modRoleId) || '`None`';

    const embed = new MessageEmbed()
      .setTitle('Settings: `System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`mod role\` was successfully updated. ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      await botset.findOneAndUpdate({
    _id: message.guild.id
  },
  {
    mod_role: null,
  },
  {
    upsert: true
  }
  )
      return message.channel.send(embed.addField('Mod Role', `${oldModRole} ➔ \`None\``));
    }

    // Update role
    const modRole = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!modRole) return this.sendErrorMessage(message, 0, 'Please mention a role or provide a valid role ID');
    await botset.findOneAndUpdate({
    _id: message.guild.id
  },
  {
    mod_role_id: modRole.id,
  },
  {
    upsert: true
  }
  )
    message.channel.send(embed.addField('Mod Role', `${oldModRole} ➔ ${modRole}`));
  }
};
