const mongo = require('../../src/mongo');
const botSet = require('../../schemas/botschema');
const userSet = require('../../schemas/userschema');
const util = require('../utils/utils')
module.exports = async (client) => {


  const activities = [

    { name:`-help`, type: 'LISTENING' },

    { name: '@Lonewolf', type: 'LISTENING' }

];




  // Update presence

  client.user.setPresence({ status: 'online', activity: activities[0] });



  let activity = 1;



  // Update activity every 30 seconds

  setInterval(() => {

    activities[2] = { name: `${client.guilds.cache.size} servers`, type: 'WATCHING' }; // Update server count

    activities[3] = { name: `${client.users.cache.size} users`, type: 'WATCHING' }; // Update user count

    if (activity > 3) activity = 0;

    client.user.setActivity(activities[activity]);

    activity++;

  

},30000);




  client.logger.info('Updating database and scheduling jobs...');
  
  
  await mongo()
    
client.Manager.init(client.user.id)
  for (const guild of client.guilds.cache.values()) {



    /** ------------------------------------------------------------------------------------------------

     * FIND SETTINGS

     * ------------------------------------------------------------------------------------------------ */ 

    // Find mod log

    const modLog = guild.channels.cache.find(c => c.name.replace('-', '').replace('s', '') === 'modlog' || 

      c.name.replace('-', '').replace('s', '') === 'moderatorlog');



    // Find admin and mod roles

    const adminRole = 

      guild.roles.cache.find(r => r.name.toLowerCase() === 'admin' || r.name.toLowerCase() === 'administrator');

    const modRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'mod' || r.name.toLowerCase() === 'moderator');

    const muteRole = guild.roles.cache.find(r => r.name.toLowerCase() === 'muted');




    /** ------------------------------------------------------------------------------------------------

     

     * ------------------------------------------------------------------------------------------------ */ 

    // Update settings table
await util.discmd(guild.id);

await util.getmodchannels(guild.id)
/*
   await botSet.findOneAndUpdate({
     _id:guild.id
   },
   {
      _id: guild.id,

     guild_name: guild.name,

  system_channel_id: guild.systemChannelID, // Default channel

  welcome_channel_id: guild.systemChannelID, // Welcome channel

  farewell_channel_id: guild.systemChannelID, // Farewell channel

    mod_log_id: modLog ? modLog.id : null,

   admin_role_id: adminRole ? adminRole.id : null,

   mod_role_id: modRole ? modRole.id : null,

   mute_role_id: muteRole ? muteRole.id : null,
   },
   
  
   
  );

    
*/
    // Update users table

 guild.members.fetch()
 //cache.forEach(member => member.fetch())
/*
 await userSet.findOneAndUpdate({
  guild_id: guild.id,
  user_id: member.id,
 },{

    user_id: member.id, 

     user_name: member.user.username, 

     user_discriminator: member.user.discriminator,
      guild_id: guild.id, 

      guild_name: guild.name,

  

        bot: member.user.bot ? 1 : 0

    },
    {
      upsert: true,
    });
    }) 
    */

    /** ------------------------------------------------------------------------------------------------

     * CHECK DATABASE

     * ------------------------------------------------------------------------------------------------ */ 

    // If member lef
let Db = await userSet.find({
  guild_id: guild.id,
  current_member: 1,
})
    const currentMemberIds = Db.user_id || [];

    for (const id of currentMemberIds) {

      if (!guild.members.cache.has(id)) {

      await userSet.findOneAndUpdate({
        _id: id,
        guild_id: guild.id

      },
      {
        current_member: 0,
      },
      {
        upsert: true
      })

      }

    }



    // If member joined
let Dd = await userSet.find({
  guild_id:guild.id,
  current_member: 0,
})

    const missingMemberIds = Dd.user_id || [];
    for (const id of missingMemberIds) {

  await userSet.findOneAndUpdate({
    user_id:id,
    guild_id:guild.id
  },
  {
    current_member: 1,
  })

    }



    /** ------------------------------------------------------------------------------------------------

     * VERIFICATION

     * ------------------------------------------------------------------------------------------------ */ 

    // Fetch verification message

let DB = await botSet.findOne({
  _id: guild.id
})
    const verificationChannelId = DB.verification_channel_id;
    const verificationMessageId  = DB.verification_message_id;
     

    const verificationChannel = guild.channels.cache.get(verificationChannelId);

    if (verificationChannel && verificationChannel.viewable) {

      try {

        await verificationChannel.messages.fetch(verificationMessageId);

      } catch (err) { // Message was deleted

        client.logger.error(err);

      }

    }

  
}

  // Remove left guilds
const dbGuilds = await botSet.find({},
{
})

  const guilds = client.guilds.cache.array();

  const leftGuilds = dbGuilds.filter(g1 => !guilds.some(g2 => g1._id === g2.id));

  for (const guild of leftGuilds) {

await botSet.findOneAndDelete({
  _id: guild._id
})

await userSet.deleteMany({
  guild_id:guild._id
})


    client.logger.info(`LoneWolf has left ${guild.guild_name}`);

  }



  client.logger.info('LoneWolf is now online');

  client.logger.info(`LoneWolf is running on ${client.guilds.cache.size} server(s)`);

};



  
 
  
      
     

      

   




  

  

     
  
