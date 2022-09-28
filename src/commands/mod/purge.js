const Command = require('../Command.js');
const { MessageEmbed } = require('discord.js');
const { oneLine, stripIndent } = require('common-tags');

module.exports = class PurgeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'purge',
      aliases: ['clear'],
      usage: 'purge [channel mention/ID] [user mention/ID] <message count>',
      description: oneLine`
        Deletes the specified amount of messages from the provided channel. 
        If no channel is given, the messages will be deleted from the current channel.
        If a member is provided, only their messages will be deleted from the batch.
        No more than 100 messages may be deleted at a time.
        Messages older than 2 weeks old cannot be deleted.
      `,
      type: client.types.MOD,
      clientPermissions: ['SEND_MESSAGES', 'EMBED_LINKS', 'MANAGE_MESSAGES'],
      userPermissions: ['MANAGE_MESSAGES'],
      examples: ['purge 20', 'purge #general 10', 'purge @Jack 50', 'purge #general @Jack 5']
    });
  }
  async run(message, args) {

    let channel = this.getChannelFromMention(message, args[0]) || message.guild.channels.cache.get(args[0]);
    if (channel) {
      args.shift();
    } else channel = message.channel;

    // Check type and viewable
    if (channel.type != 'text' || !channel.viewable) return this.sendErrorMessage(message, 0, stripIndent`
      Please mention an accessible text channel or provide a valid text channel ID
    `);

    let member = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]);
    if (member) {
      args.shift();
    }

    const amount = parseInt(args[0]);
    if (isNaN(amount) === true || !amount || amount < 0 || amount > 100)
      return this.sendErrorMessage(message, 0, 'Please provide a message count between 1 and 100');

    // Check channel permissions
    if (!channel.permissionsFor(message.guild.me).has(['MANAGE_MESSAGES']))
      return this.sendErrorMessage(message, 0, 'I do not have permission to manage messages in the provided channel');


    await message.delete(); // Delete command message

    // Find member messages if given
    let messages;
    if (member) {
      messages = (await channel.messages.fetch({ limit: amount })).filter(m => m.member.id === member.id);
    } else messages = amount;

    if (messages.size === 0) { // No messages found
    const em = new MessageEmbed()
    .setAuthor("Purge Failed!")
    .setDescription("Unable to find any messages from the member")
    .setTimestamp()
    .setFooter("Will be deleted in 5s")
    .setColor("RED")
      message.channel.send({ embeds: [embed]}).then(msg => setTimeout(()=>{
        msg.delete()}, 5000)).catch(err => message.client.logger.error(err.stack));

    } else { // Purge messages

      channel.bulkDelete(messages, true).then(messages => {
        const embed = new MessageEmbed()
          .setAuthor('Purged')
          .setDescription(`
            Successfully deleted **${messages.size}** message(s). 
          `)
          .addField('Channel', channel, true)
          .addField('Message Count', `\`${messages.size}\``, true)
          .setFooter("will be deleted in 10s ",  message.author.displayAvatarURL({ dynamic: true }))
          .setTimestamp()
          .setColor("#00E676");

        message.channel.send({ embeds: [embed] } ).then(msg => setTimeout(() =>{
          
         msg.delete
         }, 10000))
          .catch(err => message.client.logger.error(err.stack));
      });
    }
  
  }
};
