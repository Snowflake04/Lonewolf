const Command = require('../Command.js');



const { MessageEmbed } = require('discord.js');



  const fetch = require('node-fetch');

  

  

module.exports = class EjectCommand extends Command {

  constructor(client) {

    super(client, {

      name: 'eject',

      usage: 'eject <user mention>',

      description: 'Yeets the person into Space.\n The Could have been an Imposter all this While...',

      type: client.types.FUN,

      examples: ['eject @john']

    });

  }



    async run(message, args)  {

    

         try {

 
 const m = this.getMemberFromMention(message, args[0]) || message.guild.members.cache.get(args[0]) || message.member;
const user = m.nickname || m.user.username;
    const imp = [true, false];

    const imposter = imp[Math.floor(Math.random() * imp.length)];

    const crew = ["black", "blue", "brown", "cyan", "darkgreen", "lime", "orange", "pink", "purple", "red", "white", "yellow"];

    const crewmate = crew[Math.floor(Math.random() * crew.length)];

    

    const data = await fetch(`https://vacefron.nl/api//ejected?name=${user}&impostor=${imposter}&crewmate=${crewmate}`);

    

    const embed = new MessageEmbed()

      .setAuthor(message.author.username + "#" + message.author.discriminator, message.author.displayAvatarURL())

      .setTitle(`${message.author.username} decided to eject ${user}`)

      .setColor(message.guild.me.displayHexColor)

      .setImage(`${data.url}`)

      

    message.channel.send({ embeds: [embed] } );

  }catch(err) {

    const embed2 = new MessageEmbed()

    .setTitle(`:x: Something went wrong.\n :x: Note : It won't work if the User contains Unwanted characters in his Username. \n Try adding nickname or changing the Username`)

    .setColor(message.guild.me.displayHexColor)

    message.channel.send(embed2);

    }



    }

};



