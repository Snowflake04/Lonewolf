const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const userset = require('../../../schemas/userschema')

module.exports = class WarnCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'warn',
      usage: 'warn <user mention/ID> [reason]',
      description: 'Warns a member in the server.',
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'KICK_MEMBERS'],
      userPermissions: ['KICK_MEMBERS'],
      examples: ['warn @Lone']
    });
  }
  async run(message, args) {

    const member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (!member)
      return this.sendErrorMessage(message, 0, 'Please mention a user or provide a valid user ID');
    if (member === message.member)
      return this.sendErrorMessage(message, 0, 'You cannot warn yourself');
    if (member.roles.highest.position >= message.member.roles.highest.position)
      return this.sendErrorMessage(message, 0, 'You cannot warn someone with an equal or higher role');

    let db = await this.getGuild(message.guild.id);

    const autoKick = db.auto_kick; // Get warn # for auto kick

    let reason = args.slice(1).join(' ');
    if (!reason) reason = null;
    if (reason.length > 1024) reason = reason.slice(0, 1021) + '...';

    let user = await this.getUser(member.id, message.guild.id)


    let warns = user.warns || { warns: [] };
    if (typeof(warns) == 'string') warns = JSON.parse(warns);
    const warning = {
      mod: message.member.id,
      date: moment().format('MMM DD YYYY'),
      reason: reason
    };

    warns.warns.push(warning);

    await userset.findOneAndUpdate({
      user_id: member.id,
      guild_id: message.guild.id
    },
    {
      warns: JSON.stringify(warns)
    },
    {
      upsert: true,
    })
    let value = this.client.utils.embedColor(message.guild.id)
    const embed = new MessageEmbed()
    try {
      member.user.send(`You have been warned on **${message.guild.name}** ${reason ? `for **${reason}**`: ''}`)
    } catch (err) {
      embed.setFooter("unable to dm")
    }
    embed
      .setAuthor("Warned")
      .setDescription(`${member} has been warned ${reason ? `for **${reason}**` : ''}.`)
      .setTimestamp()
      .setColor(value ? "RANDOM" : message.guild.me.displayHexColor);
    message.channel.send({ embeds: [embed] });
    message.client.logger.log(`${message.guild.name}: ${message.author.tag} warned ${member.user.tag}`);

    // Update mod log
    let s = this.setCase(message)
    if (s[1]) {
      embed
        .setAuthor("Warn")
        .setDescription(`${member} was warned`)
        .addField("Warned by", message.member)
        .addField("Warn count ", warns.warns.length)
      if (reason) embed.addField("Reason", reason)
        .setFooter(`Case #${s[0]}`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      s[1].send({ embeds: [embed] })
    }


    // Check for auto kick
    if (autoKick && warns.warns.length === autoKick) {
      message.client.commands.get('kick')
        .run(message, [member.id, `Warn limit reached. Automatically kicked by ${message.guild.me}.`]);
    }
  }
};