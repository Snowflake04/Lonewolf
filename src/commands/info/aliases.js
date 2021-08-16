const Command = require('../Command.js');

const { MessageEmbed } = require('discord.js');

const emojis = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');
const util = require('../../utils')
module.exports = class AliasesCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'aliases',
      aliases: ['alias', 'ali', 'a'],
      usage: 'aliases [command type]',
      description: oneLine`
        Displays a list of all current aliases for the given command type. 
        If no command type is given, the amount of aliases for every type will be displayed.
      `,
      type: client.types.INFO,
      examples: ['aliases Fun']
    });
  }
 async run(message, args) {

    // Get disabled commands
    let disabledCommands = await util.discmds(message.guild.id)  || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    const aliases = {};
    const embed = new MessageEmbed();
    for (const type of Object.values(message.client.types)) {
      aliases[type] = [];
    }

    const type = (args[0]) ? args[0].toLowerCase() : '';
    const types = Object.values(message.client.types);
    const { INFO, FUN, COLOR, MISC, MUSIC, MOD, ADMIN, OWNER } = message.client.types;
    const { capitalize } = message.client.utils;

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
    
    if (args[0] && types.includes(type) && (type != OWNER || message.client.isOwner(message.member))) {
      
      message.client.commands.forEach(command => {
        if (command.aliases && command.type === type && !disabledCommands.includes(command.name)) 
          aliases[command.type].push(`**${command.name}:** ${command.aliases.map(a => `\`${a}\``).join(' ')}`);
      });

      embed
        .setTitle(`Alias Type: \`${capitalize(type)}\``)
        .setThumbnail('https://i.imgur.com/sqhfR5J.jpg')
        .addField(
          `**${emojiMap[type]} [${aliases[type].reduce((a, b) => a + b.split(' ').slice(1).length, 0)}]**`, 
          aliases[type].join('\n')
        )
        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);

    } else if (type) {
      return this.sendErrorMessage(message, 0, 'Unable to find command type, please check provided type');

    } else {

      message.client.commands.forEach(command => {
        if (command.aliases && !disabledCommands.includes(command.name)) 
          aliases[command.type].push(`**${command.name}:** ${command.aliases.map(a => `\`${a}\``).join(' ')}`);
      });

      const prefix = await util.getprefix(message.guild.id);

      embed
        .setTitle('LoneWolf\'s Alias Types')
        .setDescription(stripIndent`
          **Prefix:** \`${prefix}\`
          **More Information:** \`${prefix}aliases [command type]\`
        `)
        .setImage('https://i.imgur.com/oMo5eEG.jpg')
        .setFooter(message.member.displayName, message.author.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(message.guild.me.displayHexColor);

      for (const type of Object.values(message.client.types)) {
        if (type === OWNER && !message.client.isOwner(message.member)) continue;
        if (aliases[type][0]) 
          embed.addField(
            `**${emojiMap[type]}**`, `
            \`${aliases[type].reduce((a, b) => a + b.split(' ').slice(1).length, 0)}\` aliases`, 
            true
          );
      }

    }

    message.channel.send(embed);
  }
};


