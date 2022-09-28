const Command = require('../Command.js');

const { MessageEmbed } = require('discord.js');

const disbut = require('discord.js');

module.exports = class VoteCommand extends Command {

  constructor(client) {

    super(client, {

      name: 'vote',

      aliases: ['upvote'],

      description: 'Vote for Lonewolf.',

      type: client.types.MISC,

    });

  }

  async run(message) {

 

 const embed = new MessageEmbed()

 .setTitle("Vote for LoneWolf!")

 .setThumbnail('https://i.imgur.com/sqhfR5J.jpg')

 .setDescription('Help LoneWolf in its growth by voting for it. It helps me to keep the bot free and bring forth new features.')

    .setTimestamp()

    .setFooter('LoneWolf', 'https://tenor.com/view/dog-wolf-magnificent-snowing-snow-gif-17836245.gif')

const btn1 = new disbut.MessageButton()

.setStyle('url')

.setLabel('Top.gg')

.setURL('https://top.gg/bot/795952530735104010/vote')

.setEmoji('📮')

await message.channel.send({embed: embed, button: btn1});

  }

  }
