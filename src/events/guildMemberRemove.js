const { MessageEmbed } = require('discord.js');
const botSet = require('../../schemas/botschema');
const userSet = require('../../schemas/userschema');

module.exports = async (client, member) => {

  if (member.user === client.user) return;

  client.logger.info(`${member.guild.name}: ${member.user.tag} has left the server`);

  /** ------------------------------------------------------------------------------------------------
   * MEMBER LOG
   * ------------------------------------------------------------------------------------------------ */
  // Get member log
const Db = await botSet.findOne({
  _id: member.guild.id
})
  const memberLogId = Db.member_log_id;
  const memberLog = member.guild.channels.cache.get(memberLogId);
  if (
    memberLog &&
    memberLog.viewable &&
    memberLog.permissionsFor(member.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
  ) {
    const embed = new MessageEmbed()
      .setTitle('Member Left')
      .setAuthor(`${member.guild.name}`, member.guild.iconURL({ dynamic: true }))
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .setDescription(`${member} (**${member.user.tag}**)`)
      .setTimestamp()
      .setColor(member.guild.me.displayHexColor);
    memberLog.send(embed);
  }

  /** ------------------------------------------------------------------------------------------------
   * FAREWELL MESSAGES
   * ------------------------------------------------------------------------------------------------ */ 
  // Send farewell message
  let farewellChannelId = Db.farewell_channel_id;
  let farewellMessage  = Db.farewell_message;
  const farewellChannel = member.guild.channels.cache.get(farewellChannelId);
  
  if (
    farewellChannel &&
    farewellChannel.viewable &&
    farewellChannel.permissionsFor(member.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS']) &&
    farewellMessage
  ) {
    farewellMessage = farewellMessage
      .replace(/`?\?member`?/g, member) // Member mention substitution
      .replace(/`?\?username`?/g, member.user.username) // Username substitution
      .replace(/`?\?tag`?/g, member.user.tag) // Tag substitution
      .replace(/`?\?size`?/g, member.guild.members.cache.size); // Guild size substitution
    farewellChannel.send(new MessageEmbed().setDescription(farewellMessage).setColor(member.guild.me.displayHexColor));
  }
  
  /** ------------------------------------------------------------------------------------------------
   * USERS TABLE
   * ------------------------------------------------------------------------------------------------ */ 
  // Update users table
await userSet.findOneAndDelete({
  user_id:member.id,
  guild_id:member.guild.id
}

 



)
};
