const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const emojis = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');
const { MessageButton, MessageActionRow } = require('discord-buttons');
const util = require('../../utils')
module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      aliases: ['commands', 'h'],
      usage: 'help [command | all]',
      description: oneLine`
        Displays a list of all current commands, sorted by category. 
        Can be used in conjunction with a command for additional information.
        Will only display commands that you have permission to access unless the \`all\` parameter is given.
      `,
      type: client.types.INFO,
      examples: ['help ping'],
      cooldown: 10
    });
  }
  async run(message, args) {

    
    // Get disabled commands
    let disabledCommands = util.discmds(message.guild.id)|| [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');
    
         const commands = {};
      for (const type of Object.values(message.client.types)) {
        commands[type] = [];
}
  const types = Object.values(message.client.types);
var type = [];
    const all = (args[0] === 'all') ? args[0] : '';
   type = (args[0] === 'all') ? '' : args[0];
   const prefix = await util.getprefix(message.guild.id); // Get prefix
    const { INFO, FUN, COLOR, MISC, MUSIC, MOD, ADMIN, OWNER } = message.client.types;
    const { capitalize } = message.client.utils;
      
      
    const embed2 = new MessageEmbed()  

      const emojiMap = {
        [INFO]: `${emojis.info} ${capitalize(INFO)}`,
        [FUN]: `${emojis.fun} ${capitalize(FUN)}`,
        [COLOR]: `${emojis.color} ${capitalize(COLOR)}`,
        [MISC]: `${emojis.misc} ${capitalize(MISC)}`,
        [MUSIC]: `${emojis.music} ${capitalize(MUSIC)}`,
        [MOD]: `${emojis.mod} ${capitalize(MOD)}`,
        [ADMIN]: `${emojis.admin} ${capitalize(ADMIN)}`,
        [OWNER]: `${emojis.owner} ${capitalize(OWNER)}`
      };
///////////////////////////////////////

const del = new MessageButton()
.setStyle("red")
.setLabel("")
.setEmoji("🗑️")
.setID(message.author.id + " del")

const info = new MessageButton()
.setStyle("blurple")
.setLabel("info")
.setID("info noperm 0")


const fun = new MessageButton()
.setStyle("blurple")
.setLabel("fun")
.setID("fun noperm 1")

const color = new MessageButton()
.setStyle("blurple")
.setLabel("color")
.setID("color noperm 2")

const misc = new MessageButton()
.setStyle("blurple")
.setLabel("misc")
.setID("misc noperm 3")

const music = new MessageButton()
.setStyle("blurple")
.setLabel("music")
.setID("music noperm 4")

const mod = new MessageButton()
.setStyle("blurple")
.setLabel("mod")
.setID("mod perm 0")

const admin = new MessageButton()
.setStyle("blurple")
.setLabel("admin")
.setID("admin perm 1")


 var noperm = new MessageActionRow()
 .addComponent(info)
  .addComponent(fun)
 .addComponent(color)
 .addComponent(misc)
 .addComponent(music)
 
 var perm = new MessageActionRow()
 .addComponent(mod)
 .addComponent(admin)
 .addComponent(del)

//////////////////////////////////////
    const command = message.client.commands.get(type) || message.client.aliases.get(type);
    
    if ( args[0] &&
      command && 
      (command.type != OWNER || message.client.isOwner(message.member)) && 
      !disabledCommands.includes(command.name)
    ) {
      embed2 // Build specific command help embed
        .setTitle(`Command: \`${command.name}\``)
        .setThumbnail('https://i.imgur.com/sqhfR5J.jpg')
        .setDescription(command.description)
        .addField('Usage', `\`${prefix}${command.usage}\``, true)
        .addField('Type', `\`${capitalize(command.type)}\``, true)
        .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);
      if (command.aliases) embed2.addField('Aliases', command.aliases.map(c => `\`${c}\``).join(' '));
      if (command.examples) embed2.addField('Examples', command.examples.map(c => `\`${prefix}${c}\``).join('\n'));
   
      message.channel.send({ embed : embed2, button : del
      })
    }
    

 
else if (args[0] && types.includes(type) && (type != OWNER || message.client.isOwner(message.member))) {
          message.client.commands.forEach(command => {
  if (!disabledCommands.includes(command.name) && command.type === type ) {
    if (command.userPermissions && command.userPermissions.every(p => message.member.hasPermission(p)) && !all){
      commands[command.type].push(`  \`${command.name}\`  **|**`);
    }
   else if (!command.userPermissions || all) {
            commands[command.type].push(`  \`${command.name}\`  **|**`);
          }
        }
      });

      
      const embed = new MessageEmbed()

      embed // Build help embed
        .setTitle('LoneWolf\'s Commands')
        .setDescription(stripIndent`
          **More Information:** \`${prefix}help [command]\`
        `)
        .setFooter( message.member.displayName, 
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTimestamp()

        .setImage('https://i.imgur.com/oMo5eEG.jpg')
        .setColor(message.guild.me.displayHexColor);

      if(commands[type].length !== 0 )
         {
           embed.addField(`**${emojiMap[type]} [${commands[type].length}]**`, commands[type].join(' '));
          
 }
 if(commands[type].length === 0)
 {
   embed.addField("Oops"
 , 'You do not have Permission to acess this Category');
   
 }

      embed.addField(
        '**Links**',
        '[invite Me](https://discord.com/api/oauth2/authorize?client_id=795952530735104010&permissions=502656374&scope=bot) |' + ' [Support Server](https://discord.gg/JFD3GfEURU) |'+ ' [Dashboard](https://lone.epizy.com) '
        );
     
    
  message.channel.send({embed :embed , button: del})
  
 
    } else if (args.length > 0 && !all && !commands.type) {
      return this.sendErrorMessage(message, 0, 'Unable to find command, please check provided command');
    } else {
    
  message.client.commands.forEach(command => {
   if (!disabledCommands.includes(command.name)) {
    if (command.userPermissions && command.userPermissions.every(p => message.member.hasPermission(p)) && !all)
    commands[command.type].push(` \`${command.name}\` `);
           
   else if (!command.userPermissions || all) {
            commands[command.type].push(` \`${command.name}\` `);
          }
        }
      });
        
      
      
      const embed3 = new MessageEmbed()

      embed3 // Build help embed
        .setTitle('LoneWolf\'s Commands')
        .setDescription(stripIndent`
          **Prefix:** \`${prefix}\`
          **More Information:** \`${prefix}help [Category]\`
        `)
        .setFooter( message.member.displayName, 
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTimestamp()
   
        .setImage('https://i.imgur.com/oMo5eEG.jpg')
        .setColor(message.guild.me.displayHexColor);

      for (const type of Object.values(message.client.types)) {
              if (type === OWNER && !message.client.isOwner(message.member)) continue;
        if (commands[type][0])
          embed3.addField(`**${emojiMap[type]}**`, `
            \`${commands[type].length} \`commands`, 
            true
);
      }

      embed3.addField(
        '**Links**',
        '[Invite Me](https://discord.com/api/oauth2/authorize?client_id=795952530735104010&permissions=502656374&scope=bot) |' + ' [Support Server](https://discord.gg/JFD3GfEURU) |'+ ' [Dashboard](https://lone.epizy.com)'
        );
 let wt = await message.channel.send({embed : embed3 , components : [noperm,perm]})
    let collector = wt.createButtonCollector(b => b ,{time: 5*60*1000}); 

   collector.on('collect', async button =>{
     
    if(button.clicker.user.id !== message.author.id){
      return button.reply.send("This can Only be used by the person who Requested", true)
    }
     button.reply.defer()
     let v = button.id.split(' ')
     if(v[1] !== "del")
     {
   type = v[0]
   
   button.message.components[0].components.forEach(com =>{
     com.setDisabled(false)
     com.setStyle('blurple')
   })
   button.message.components[1].components.forEach(co => {
     if(co.label){
       co.setDisabled(false)
       co.setStyle('blurple')
     }
   })
   
   if(v[1] === "noperm"){
   button.message.components[0].components[v[2]].setDisabled(true).setStyle('green')
   }
   if(v[1] === "perm"){
     button.message.components[1].components[v[2]].setDisabled(true).setStyle('green')
   }
  
   const em4 = new MessageEmbed()
 
      em4// Build help embed
        .setTitle('LoneWolf\'s Commands')
        .setDescription(stripIndent`
          **More Information:** \`${prefix}help [command]\`
        `)
        .setFooter( message.member.displayName, 
          message.author.displayAvatarURL({ dynamic: true })
        )
        .setTimestamp()
   
        .setImage('https://i.imgur.com/oMo5eEG.jpg')
        .setColor(message.guild.me.displayHexColor);

      if(commands[type].length !== 0 )
         {
           em4.addField(`**${emojiMap[type]} [${commands[type].length}]**`,commands[type].join(' ' ));
          
 }
       if(commands[type].length === 0)
       {
         em4.addField('Oops',
         'You do not have permission to use this Commands. \n If You want to view this section use \`help all\` command and navigate to the section' 
     )  }
 
      em4.addField(
        '**Links**',
        '[invite Me](https://discord.com/api/oauth2/authorize?client_id=795952530735104010&permissions=502656374&scope=bot) |' + ' [Support Server](https://discord.gg/JFD3GfEURU) |'+ ' [Dashboard](https://lone.epizy.com)'
        );
        

button.message.edit({embed : em4, components : button.message.components })
     }
    })
    }
}
};
