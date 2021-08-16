const { MessageEmbed } = require('discord.js');
const colors = require('../utils/colors.json');
const { success } = require('../utils/emojis.json');
const botSet = require('../../schemas/botschema');
const userSet = require('../../schemas/userschema');
module.exports = async (client, guild) => {

  client.logger.info(`LoneWolf has joined ${guild.name}`);
  const serverLog = client.channels.cache.get(client.serverLogId);
  if (serverLog)
    serverLog.send(new MessageEmbed().setDescription(`${client.user} has joined **${guild.name}** ${success}`));

  /** ------------------------------------------------------------------------------------------------
   * CREATE/FIND SETTINGS
   * ------------------------------------------------------------------------------------------------ */ 
  // Find mod log
  const modLog = guild.channels.cache.find(c => c.name.replace('-', '').replace('s', '') === 'modlog' || 
    c.name.replace('-', '').replace('s', '') === 'moderatorlog');

  // Find admin and mod roles
  const adminRole = 
    guild.roles.cache.find(r => r.name.toLowerCase() === 'admin' || r.name.toLowerCase() === 'administrator');
  const modRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'mod' || r.name.toLowerCase() === 'moderator');

  // Create mute role
  let muteRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');
  if (!muteRole) {
    try {
      muteRole = await guild.roles.create({
        data: {
          name: 'Muted',
          permissions: []
        }
      });
    } catch (err) {
      client.logger.error(err.message);
    }
    for (const channel of guild.channels.cache.values()) {
      try {
        if (channel.viewable && channel.permissionsFor(guild.me).has('MANAGE_ROLES')) {
          if (channel.type === 'text') // Deny permissions in text channels
            await channel.updateOverwrite(muteRole, {
              'SEND_MESSAGES': false,
              'ADD_REACTIONS': false
            });
          else if (channel.type === 'voice' && channel.editable) // Deny permissions in voice channels
            await channel.updateOverwrite(muteRole, {
              'SPEAK': false,
              'STREAM': false
            });
        } 
      } catch (err) {
        client.logger.error(err.stack);
      }
    }
  }
  
  // Create crown role
  

  /** ------------------------------------------------------------------------------------------------
   * UPDATE TABLES
   * ------------------------------------------------------------------------------------------------ */ 
  // Update settings table
 await botSet.findOneAndUpdate({
  _id: guild.id
   
 },
  {
    _id: guild.id,
   guild_name: guild.name,
    system_channel_id: guild.systemChannelID, // Default channel
   welcome_channel_id: guild.systemChannelID, // Welcome channel

    random_color: 0, 
    farewell_channel_id: guild.systemChannelID, // Farewell channel
    crown_channel_id: guild.systemChannelID,  // Crown Channel
    mod_lod_id: modLog ? modLog.id : null,
    admin_role_id: adminRole ? adminRole.id : null,
    mod_role_id: modRole ? modRole.id : null,
    mute_role_id: muteRole ? muteRole.id : null,
   
  },
  {
    upsert: true,
  }
);

  // Update users table
 guild.members.cache.forEach(async member =>{
 
  let vt = await userSet.findOneAndUpdate({
     user_id: member.id,
    guild_id: guild.id
    },
     {
    user_id: member.id, 
     user_name: member.user.username, 
     user_discriminator: member.user.discriminator,
     guild_id: guild.id, 
     guild_name: guild.name,
      guild_joined: member.joinedAt.toString(),
     bot: member.user.bot ? 1 : 0},
  {
    upsert: true,
  })
 })


  /** ------------------------------------------------------------------------------------------------
   * DEFAULT COLORS
   * ------------------------------------------------------------------------------------------------ */ 
  // Create default colors
  let position = 1;
  for (let [key, value] of Object.entries(colors)){
    key = '#' + key;
    if (!guild.roles.cache.find(r => r.name === key)) {
      try {
        await guild.roles.create({
          data: {
            name: key,
            color: value,
            position: position,
            permissions: []
          }
        });
        position++; // Increment position to create roles in order
      } catch (err) {
        client.logger.error(err.message);
      }
    }
  }

  // Self-assign color
  try {
    const calypsoColor = guild.roles.cache.find(r => r.name === '#Seagrass');
    if (calypsoColor) await guild.me.roles.add(calypsoColor);
  } catch (err) {
    client.logger.error(err.message);
  }
  
};
