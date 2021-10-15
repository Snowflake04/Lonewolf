const Command = require('../Command.js');

const { MessageEmbed } = require('discord.js');

const pkg = require(__basedir + '/package.json');
const { owner } = require('../../utils/emojis.json');
const { oneLine, stripIndent } = require('common-tags');

const util = require('../../utils/utils')

module.exports = class BotInfoCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'botinfo',
      aliases: ['bot', 'bi'],
      usage: 'botinfo',
      description: 'Fetches Lonewolf\'s bot information.',
      type: client.types.INFO
    });
  }
  async run(message) {
    
    const botOwner = message.client.users.cache.get(message.client.ownerId);
    const prefix = await util.getprefix(message.guild.id);
    const tech = stripIndent`
      Version     :: ${pkg.version}
      Library     :: Discord.js v12.55.1
      Environment :: Node.js v14.16.1
      Database    :: SQLite
    `;
    const embed = new MessageEmbed()
      .setTitle('Lonewolf\'s Bot Information')
      .setDescription(oneLine`
        Lonewolf  is a fully customizable Discord bot. It comes s packaged with a variety of commands and 
        a multitude of settings that can be tailored to your server's specific needs. 
         
       `)  
       .addField('Note:','The bot is still under development')
         
        
      
      .addField('Prefix', `\`${prefix}\``, true)
      .addField('Client ID', `\`${message.client.user.id}\``, true)
      .addField(`Developer ${owner}`, botOwner, true)
      .addField('Tech', `\`\`\`asciidoc\n${tech}\`\`\``)

  .setImage('https://i.imgur.com/sqhfR5J.jpg')
      .setFooter(message.member.displayName,  message.author.displayAvatarURL({ dynamic: true }))
      .setTimestamp()
      .setColor(message.guild.me.displayHexColor);
    message.channel.send({ embeds: [embed] } );
  }
};


