const { MessageEmbed } = require('discord.js');
const { oneLine } = require('common-tags');
const util = require('../utils/utils');
const fetch = require('node-fetch')
module.exports = async (client, message) => {
  if(message.channel.type === 'dm' && !message.author.bot){
 let reply = await fetch(`http://api.brainshop.ai/get?bid=158012&key=LnZfpAIrVaiHJMFQ&uid=${message.author.username}&msg=${message.content}`)
reply = await reply.json()
 message.channel.send(reply.cnt)
  }
  if (!message.channel.viewable || message.author.bot) return;
  // Get disabled commands
/*if(message.channel === 'dm'){
  console.log("yes")
}*/
  let disabledCommands = util.discmds(message.guild.id) || [];
  if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');
   

  // Command handler
 
  const prefix = await util.getprefix(message.guild.id)|| "-";
  const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})\\s*`);
  if (prefixRegex.test(message.content)) {



    const [, match] = message.content.match(prefixRegex);
    const args = message.content.slice(match.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    let command = client.commands.get(cmd) || client.aliases.get(cmd); // If command not found, check aliases
    if (command && !disabledCommands.includes(command.name)) {

      // Check if mod channe
 

      // Check permissions
      const permission = command.checkPermissions(message);
      if (permission) {
const cooldown = command.getOrCreateCooldown(message.author)
      if (cooldown) return command.sendCooldownMessage(message, cooldown);
      
       message.command = true; // Add flag for messageUpdate event
        return command.run(message, args); // Run command

     }
     }else if ( 
      (message.content === `<@${client.user.id}>` || message.content === `<@!${client.user.id}>`) &&
      message.channel.permissionsFor(message.guild.me).has(['SEND_MESSAGES', 'EMBED_LINKS']) 
    ) {
      const embed = new MessageEmbed()
        .setTitle('<a:wel:839173116655435786> HI , I\'m LoneWolf. Need help?')
        .setThumbnail('https://i.imgur.com/sqhfR5J.jpg')
        .setDescription(`  You  can see everything I can do by using the \`${prefix}help\` command.`) 
        .addField('Invite Me',  oneLine`

          To invite me to your Totally Awesome Server, just click

          [here](https://discord.com/api/oauth2/authorize?client_id=795952530735104010&permissions=3757964662&scope=bot)!
         
        `)
        .addField('Support', oneLine`
          If you have questions, suggestions, or found a bug, join the [Support Server](https://discord.gg/JFD3GfEURU)!
        `)
        .setFooter('DM Lonewolf#0050 for Assistance and concerns!!')
        .setColor(message.guild.me.displayHexColor);
      message.channel.send({ embeds: [embed] } );
    }
  }
}

