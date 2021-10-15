const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { success, fail } = require('../../utils/emojis.json');
const { oneLine } = require('common-tags');
const util = require('../../utils/utils')
module.exports = class ToggleTypeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'toggletype',
      aliases: ['togglet', 'togt', 'tt'],
      usage: 'toggletype <command type>',
      description: oneLine`
        Enables or disables the provided command type.
        Commands of the provided type will disabled unless they are all already disabled,
        in which case they will be enabled. 
        Disabled commands will no longer be able to be used, and will no longer show up with the \`help\` command.
        \`${client.utils.capitalize(client.types.ADMIN)}\` commands cannot be disabled.
      `,
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
      examples: ['toggletype Fun']
    });
  }
  async run(message, args) {
   

    const { ADMIN, OWNER } = message.client.types;

    if (args.length === 0 || args[0].toLowerCase() === OWNER)
      return this.sendErrorMessage(message, 0, 'Please provide a valid command type');
    
    const type = args[0].toLowerCase();
        // Map types
    const types = Object.values(message.client.types);
    const commands = message.client.commands.array().filter(c => c.type === type);
    const { capitalize } = message.client.utils;
    
    if (type === ADMIN) return this.sendErrorMessage(message, 0, `${capitalize(ADMIN)} commands cannot be disabled`);

    let disabledCommands = util.discmds(message.guild.id) || [];
    if (typeof(disabledCommands) === 'string') disabledCommands = disabledCommands.split(' ');

    let description;



    // Disable type
    if (types.includes(type)) {

      // Enable type
      if (commands.every(c => disabledCommands.includes(c.name))) {
        for (const cmd of commands) {
          if (disabledCommands.includes(cmd.name)) message.client.utils.removeElement(disabledCommands, cmd.name);
        }
        description = `All \`${capitalize(type)}\` type commands have been successfully **enabled**. ${success}`;
      
      // Disable type
      } else {
        for (const cmd of commands) {
          if (!disabledCommands.includes(cmd.name)) disabledCommands.push(cmd.name);
        }
        description = `All \`${capitalize(type)}\` type commands have been successfully **disabled**. ${fail}`;
      }
    } else return this.sendErrorMessage(message, 0, 'Please provide a valid command type');
    let dt = disabledCommands.join(' ')
    
await util.updatedisabledcommands(message.guild.id, dt)
    disabledCommands = disabledCommands.map(c => `\`${c}\``).join(' ') || '`None`';
    const embed = new MessageEmbed()
      .setTitle('Settings: `System`')
      .setThumbnail(message.guild.iconURL({ dynamic: true }))
      .setDescription(description)
      .addField('Disabled Commands', disabledCommands, true)
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send({ embeds: [embed] } );
  }
};
