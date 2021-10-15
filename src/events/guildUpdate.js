const botSet = require('../../schemas/botschema');
const userSet = require('../../schemas/userschema');
module.exports = async (client, oldGuild, newGuild) => {

  if (oldGuild.name == newGuild.name) return;

  await botSet.findOneAndUpdate({
    _id: oldGuild.id
  },
  {
    guild_name: newGuild.name
  })
  await userSet.updateMany({
    guild_id: oldGuild.id
  },
  {
    guild_name: newGuild.name
  },
  {
    upsert: true,
  })

  client.logger.log(`${oldGuild.name} server name changed to ${newGuild.name}`);
};