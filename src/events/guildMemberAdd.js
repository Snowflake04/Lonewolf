const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { stripIndent } = require('common-tags');
const botSet = require('../../schemas/botschema');
const userSet = require('../../schemas/userschema');

module.exports = async (client, member) => {

  client.logger.info(`${member.guild.name}: ${member.user.tag} has joined the server`);

  /** ------------------------------------------------------------------------------------------------
   * MEMBER LOG
   * ------------------------------------------------------------------------------------------------ */
  // Get member log
const New = await botSet.findOne({
    _id: member.guild.id
});

  const memberLogId = New.member_log_id;
  const memberLog = member.guild.channels.cache.get(memberLogId);
  if (
    memberLog &&
    memberLog.viewable &&
    memberLog.permissionsFor(member.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
  ) {
    const embed = new MessageEmbed()
      .setTitle('Member Joined')
      .setAuthor(`${member.guild.name}`, member.guild.iconURL({ dynamic: true }))
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`${member} (**${member.user.tag}**)`)
      .addField('Account created on', moment(member.user.createdAt).format('dddd, MMMM Do YYYY'))
      .setTimestamp()
      .setColor(member.guild.me.displayHexColor);
    memberLog.send(embed);
  }

  /** ------------------------------------------------------------------------------------------------
   * AUTO ROLE
   * ------------------------------------------------------------------------------------------------ */ 
  // Get auto role
  const autoRoleId = New.auto_role_id;
  const autoRole = member.guild.roles.cache.get(autoRoleId);
  if (autoRole) {
    try {
      await member.roles.add(autoRole);
    } catch (err) {
      client.sendSystemErrorMessage(member.guild, 'auto role', stripIndent`
        Unable to assign auto role, please check the role hierarchy and ensure I have the Manage Roles permission
      `, err.message);
    }
  }

  /** ------------------------------------------------------------------------------------------------
   * WELCOME MESSAGES
   * ------------------------------------------------------------------------------------------------ */ 
  // Get welcome channel
  let welcomeChannelId = New.welcome_channel_id;
  let welcomeMessage  = New.welcome_message;
  const welcomeChannel = member.guild.channels.cache.get(welcomeChannelId);

  // Send welcome message
  if (
    welcomeChannel &&
    welcomeChannel.viewable &&
    welcomeChannel.permissionsFor(member.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS']) &&
    welcomeMessage
  ) {
    welcomeMessage = welcomeMessage
      .replace(/`?\?member`?/g, member) // Member mention substitution
      .replace(/`?\?username`?/g, member.user.username) // Username substitution
      .replace(/`?\?tag`?/g, member.user.tag) // Tag substitution
      .replace(/`?\?size`?/g, member.guild.members.cache.size); // Guild size substitution
    welcomeChannel.send(new MessageEmbed().setDescription(welcomeMessage).setColor(member.guild.me.displayHexColor));
  }
  
  /** ------------------------------------------------------------------------------------------------
   * RANDOM COLOR
   * ------------------------------------------------------------------------------------------------ */ 
  // Assign random color
  const randomColor = New.random_color;
  if (randomColor) {
    const colors = member.guild.roles.cache.filter(c => c.name.startsWith('#')).array();

    // Check length
    if (colors.length > 0) {
      const color = colors[Math.floor(Math.random() * colors.length)]; // Get color
      try {
        await member.roles.add(color);
      } catch (err) {
        client.sendSystemErrorMessage(member.guild, 'random color', stripIndent`
          Unable to assign random color, please check the role hierarchy and ensure I have the Manage Roles permission
        `, err.message);
      }
    }
  }

  /** ------------------------------------------------------------------------------------------------
   * USERS TABLE
   * ------------------------------------------------------------------------------------------------ */ 
  // Update users table
  await userSet.findOneAndUpdate({
    user_id: member.id,
    guild_id: member.guild.id
  },
  {
   user_id: member.id, 
   user_name: member.user.username, 
   user_discriminator: member.user.discriminator,
   guild_id: member.guild.id, 
   guild_name: member.guild.name,
   date_joined: member.joinedAt.toString(),
    bot:member.user.bot ? 1 : 0
  },
  {
    upsert: true,
  });
  
  // If member already in users table

  
};
