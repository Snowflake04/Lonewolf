const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');

const rgx = /^(?:<@!?)?(\d+)>?$/;

module.exports = class UnbanCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'unban',
      usage: 'unban <user ID> [reason]',
      description: 'Unbans a member from your server.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'BAN_MEMBERS'],
      userPermissions: ['BAN_MEMBERS'],
      examples: ['unban 134672335474130944']
    });
  }
  async run(message, args) {
    const id = args[0];
    if (!rgx.test(id)) return this.sendErrorMessage(message, 0, 'Please provide a valid user ID');
    const bannedUsers = await message.guild.bans.fetch({ cache: false });
    const user = bannedUsers.get(id).user;
    if (!user) return this.sendErrorMessage(message, 0, 'Unable to find user, please check the provided ID');

    let reason = args.slice(1).join(' ');
    if (!reason) reason = null;
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    await message.guild.members.unban(user, reason);
    const value = this.client.utils.embedColor(message.guild.id)
    const embed = new MessageEmbed()
      .setAuthor('Member Unbanned')
      .setDescription(`${user.tag} was successfully unbanned ${reason ? `for ${reason}` : ''}`)
      .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(value ? "RANDOM" : message.guild.me.displayHexColor);

    message.channel.send({ embeds: [embed] });
    message.client.logger.log(`${message.guild.name}: ${message.author.tag} unbanned ${user.tag}`);

    // Update mod log
    let s = this.setCase(message)
    if (s[1]) {
      embed
        .setAuthor("Unbanned")
        .setThumbnail(message.guild.iconURL())
        .setDescription(`${user.tag} was unbanned`)
        .addField("Unbanned by ", message.member)
      if (reason) embed.addField("Reason", reason)
        .setColor("#00FF7F")
        .setFooter(`Case #${s[0]}`)
      s[1].send({ embeds: [embed] })
    }
  }
};