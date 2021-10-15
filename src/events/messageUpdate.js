const { MessageEmbed } = require('discord.js');
const botSet = require('../../schemas/botschema');

module.exports = async (client, oldMessage, newMessage) => {
  const Db = await botSet.findOne({
    _id: newMessage.guild.id
  })
  if (newMessage.webhookID) return; // Check for webhook

  // Detect edited commands
  if (
    newMessage.member &&
    newMessage.id === newMessage.member.lastMessageID &&
    !oldMessage.command
  ) {
    client.emit('message', newMessage);
  }

  const embed = new MessageEmbed()
    .setAuthor(`${newMessage.author.tag}`, newMessage.author.displayAvatarURL({ dynamic: true }))
    .setTimestamp()
    .setColor(newMessage.guild.me.displayHexColor);

  // Content change
  if (oldMessage.content != newMessage.content) {

    // Dont send logs for starboard edits
    const starboardChannelId = Db.starboard_channel_id;
    const starboardChannel = newMessage.guild.channels.cache.get(starboardChannelId);
    if (newMessage.channel == starboardChannel) return;

    // Get message edit log
    const messageEditLogId = Db.message_edit_log_id;
    const messageEditLog = newMessage.guild.channels.cache.get(messageEditLogId);
    if (
      messageEditLog &&
      messageEditLog.viewable &&
      messageEditLog.permissionsFor(newMessage.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {

      if (newMessage.content.length > 1024) newMessage.content = newMessage.content.slice(0, 1021) + '...';
      if (oldMessage.content.length > 1024) oldMessage.content = oldMessage.content.slice(0, 1021) + '...';

      embed
        .setTitle('Message Update: `Edit`')
        .setDescription(`
          ${newMessage.member}'s **message** in ${newMessage.channel} was edited. [Jump to message!](${newMessage.url})
        `)
        .addField('Before', oldMessage.content)
        .addField('After', newMessage.content);
      messageEditLog.send({ embeds: [embed] })
    }
  }

  // Embed delete
  if (oldMessage.embeds.length > newMessage.embeds.length) {
    // Get message delete log
    const messageDeleteLogId = Db.message_delete_log_id
    const messageDeleteLog = newMessage.guild.channels.cache.get(messageDeleteLogId);
    if (
      messageDeleteLog &&
      messageDeleteLog.viewable &&
      messageDeleteLog.permissionsFor(newMessage.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS'])
    ) {

      embed.setTitle('Message Update: `Delete`');
      if (oldMessage.embeds.length > 1)
        embed.setDescription(`${newMessage.member}'s **message embeds** in ${newMessage.channel} were deleted.`);
      else
        embed.setDescription(`${newMessage.member}'s **message embed** in ${newMessage.channel} was deleted.`);
      messageDeleteLog.send({ embeds: [embed] });
    }
  }
};