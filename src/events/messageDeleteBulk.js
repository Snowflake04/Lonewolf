const { MessageEmbed } = require('discord.js');
const botSet = require('../../schemas/botschema');

module.exports = async (client, messages) => {
  
  const message = messages.first();
  const Db = await botSet.findOne({
    _id:message.guild.id
  })
  // Get message delete log
  const messageDeleteLogId = Db.message_delete_log_id;
  const messageDeleteLog = message.guild.channels.cache.get(messageDeleteLogId);
  if (
    messageDeleteLog &&
    messageDeleteLog.viewable &&
    messageDeleteLog.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
  ) {

    const embed = new MessageEmbed()
      .setTitle('Message Update: `Bulk Delete`')
      .setAuthor(`${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
      .setDescription(`**${messages.size} messages** in ${message.channel} were deleted.`)
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    messageDeleteLog.send(embed);
  }

};