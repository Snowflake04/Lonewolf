const Command = require('../Command');
const { MessageEmbed } = require('discord.js');
const { success } = require('../../utils/emojis.json');

module.exports = class AdminRoleCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'colorembed',
      aliases: ['embedcolor', 'emcol'],
      usage: 'colorembed <true/false> ',
      description: 'sets the embed color to random if enabled. Otherwise embeds colors will be same as my highest role color',
      type: client.types.ADMIN,
      userPermissions: ['MANAGE_GUILD'],
    });
  }
  async run(message){
   const sett =this.client.utils.embedColor(message.guild.id)
   let value = !sett;
   const embed = new MessageEmbed()
   .setTitle(`${success} Settings Changed`)
   .setColor(value ? "RANDOM" : message.guild.me.displayHexColor )
   .setDescription(`Random embed color has been successfully ${value ? 'enabled' : 'disabled'}`)
  message.channel.send({embeds: [embed]})
  await this.client.utils.setColor(message.guild.id, value);
   
  }
}