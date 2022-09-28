const Command = require('../Command');
const { MessageEmbed } = require('discord.js');
const { TrackUtils } = require('erela.js');

module.exports = class SeekCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'seek',
			aliases: ['forward'],
			description: 'seeks to the provided time ',
			usage: 'seek<time / s/m/h>',
			type: client.types.MUSIC
		});
	}


	async run(message, args) {
		/*
  let player = await message.client.Manager.get(message.guild.id);
        
  if (!player) return message.channel.send("❌ | **Nothing is playing right now...**");
       
    if (!message.member.voice.channel) return message.channel.send("❌ | **You must be in a voice channel to use this command!**");
      
   if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send(":x: | **You must be in the same voice channel as me to use this command!**");
        
 if (!player.queue.current.isSeekable) return message.channel.send("❌ | **I'm not able to seek this song!**");
       
  let SeekTo = client.ParseHumanTime(args.join(" "));
        if (!SeekTo) return client.sendTime(message.channel, `**Usage - **\`${GuildDB.prefix}seek <number s/m/h>\` \n**Example - **\`${GuildDB.prefix}seek 2m 10s\``);
        player.seek(SeekTo * 1000);
        message.react("✅");
  */
		message.channel.send('Command still under Maintenance');
	}
};
