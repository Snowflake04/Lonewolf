const Command = require('../Command.js');

const { MessageEmbed } = require('discord.js');



module.exports = class RollCommand extends Command {

  constructor(client) {

    super(client, {

      name: 'iq',

      usage: 'iq [user]',

      description: 'Reveals the iq of the mentioned user. Shows your iq if no one is mentioned',

      type: client.types.FUN,

    });

  }

  

   async run (message, args)  {

    

        let user = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]) || message.member
        console.log(user.user.id)

         try {



    const iq = Math.floor(Math.random() * 226);

    const embed = new MessageEmbed()



    .setTitle(":brain: IQ Test:")

    .setDescription(`:bulb:   ${user}'s  **IQ is:**   \`${iq}\`  `)

    .setColor("FF0000")

    .setThumbnail("https://media.giphy.com/media/l44QzsOLXxcrigdgI/giphy.gif")

    .setTimestamp()

    .setFooter('LoneWolf', 'https://tenor.com/view/dog-wolf-magnificent-snowing-snow-gif-17836245.gif')

    .setColor(message.guild.me.displayHexColor);

    message.channel.send(embed);



        } catch (err) {

    message.channel.send({embed: {

      color: `${message.guild.me.displayHexColor}`,

      description: `${client.emotes.error} Something went wrong...`

    }})

  }

    }

}
    

         

    
    



