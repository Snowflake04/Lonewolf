const { MessageEmbed } = require('discord.js');
const { fail } = require('../utils/emojis.json');
const botSet = require('../../schemas/botschema');
const userSet = require('../../schemas/userschema');

module.exports = async (client, guild) => {

  client.logger.log(`LoneWolf has left ${guild.name}`);
  const serverLog = client.channels.cache.get(client.serverLogId);
  if (serverLog)
    serverLog.send(new MessageEmbed().setDescription(`${client.user} has left **${guild.name}** ${fail}`));

  const Guild = guild.id

  await userSet.deleteMany({
    guild_id: Guild
  })
  await botSet.findOneAndDelete({
    _id: Guild
  })

  if (guild.job) guild.job.cancel(); // Cancel old job

};