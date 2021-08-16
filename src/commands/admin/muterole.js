const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');
const botset = require('../../../schemas/botschema');

module.exports = class MuteRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'muterole',
      aliases: ['mutedrole'],
      usage: 'muterole <role mention/ID>',
      description: 'Sets the `mute role` your server. Provide no role to clear the current `mute role`.',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['muterole @Muted']
    });
  }
  async run(message, args) {
let db = await this.getGuild(message.guild.id);
    const muteRoleId = db.mute_role_id;
    const oldMuteRole = message.guild.roles.cache.find(r => r.id === muteRoleId) || '`None`';

    const embed = new MessageEmbed()
      .setTitle('Settings: `System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(`The \`mute role\` was successfully updated. ${success}`)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);

    // Clear if no args provided
    if (args.length === 0) {
      await botset.findOneAndUpdate({
    _id: message.guild.id
  },
  {
    mute_role_id: null,
  },
  {
    upsert: true
  }
  )
      return message.channel.send(embed.addField('Mute Role', `${oldMuteRole} ➔ \`None\``));
    }

    // Update role
    const muteRole = this.getRoleFromMention(message, args[0]) || message.guild.roles.cache.get(args[0]);
    if (!muteRole) return this.sendErrorMessage(message, 0, 'Please mention a role or provide a valid role ID');
    await botset.findOneAndUpdate({
    _id: message.guild.id
  },
  {
    mute_role_id: muteRole.id,
  },
  {
    upsert: true
  }
  )
    message.channel.send(embed.addField('Mute Role', `${oldMuteRole} ➔ ${muteRole}`));
  }
};
