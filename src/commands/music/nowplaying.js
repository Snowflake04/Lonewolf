const Command = require('../Command');
const { MessageEmbed, MessageAttachment } = require('discord.js');
const Canvas = require('canvas');
const prettyMilliseconds = require('pretty-ms');

module.exports = class NowPlayingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'nowplaying',
			aliases: ['np'],
			description: 'Shows the current playing song',
			type: client.types.MUSIC
		});
	}
	/**
	 *
	 * @param {import("../structures/DiscordMusicBot")} client
	 * @param {import("discord.js").Message} message
	 * @param {string[]} args
	 * @param {*} param3
	 */
	async run(message) {
		let player = await message.client.Manager.get(message.guild.id);
		if (!player)
			return message.channel.send('**There is nothing playing right now**');

		let song = player.queue.current;

		let pos = player.position / 1000;
		let seek = (pos / (song.duration / 1000)) * 680;
		seek = seek.toFixed(2);
		console.log(seek);
		try {
			//custom font
			Canvas.registerFont('Font.otf', { family: 'net' });
			Canvas.registerFont('Aka.ttf', { family: 'neet' });
			//making canvas
			const canvas = Canvas.createCanvas(1080, 350);
			//make it "2D"
			const ctx = canvas.getContext('2d');
			//set the Background
			const background = await Canvas.loadImage(song.displayThumbnail());

			//base image
			ctx.drawImage(background, 0, 0, 1080, 350);
			let blur = 10;
			const delta = 5;
			const alphaLeft = 1 / (2 * Math.PI * delta * delta);
			const step = blur < 3 ? 1 : 2;
			let sum = 0;
			for (let y = -blur; y <= blur; y += step) {
				for (let x = -blur; x <= blur; x += step) {
					const weight =
						alphaLeft * Math.exp(-(x * x + y * y) / (2 * delta * delta));
					sum += weight;
				}
			}
			for (let y = -blur; y <= blur; y += step) {
				for (let x = -blur; x <= blur; x += step) {
					ctx.globalAlpha =
						((alphaLeft * Math.exp(-(x * x + y * y) / (2 * delta * delta))) /
							sum) *
						blur;
					ctx.drawImage(ctx.canvas, x, y);
				}
			}
			ctx.globalAlpha = 1;

			ctx.globalCompositeOperation = 'source-atop';
			//top image
			ctx.drawImage(background, 0, 0, 350, 350);

			ctx.font = '48px neet';
			ctx.shadowColor = 'd3d3d3';
			ctx.shadowBlur = 10;
			ctx.lineWidth = 3;
			ctx.strokeText(`Title: ${song.title}`, 370, 80, 695);
			ctx.shadowBlur = 3;
			ctx.fillStyle = 'white';
			ctx.fillText(`Title: ${song.title}`, 370, 80, 695);

			ctx.font = '36px net';
			ctx.shadowColor = 'd3d3d3';
			ctx.shadowBlur = 10;
			ctx.lineWidth = 2;
			ctx.strokeText(`Author: ${song.author}`, 370, 150, 695);
			ctx.shadowBlur = 3;
			ctx.fillStyle = 'white';
			ctx.fillText(`Author: ${song.author}`, 370, 150, 695);

			//elapsed
			ctx.font = '29px net';
			ctx.shadowColor = 'd3d3d3';
			ctx.shadowBlur = 10;
			ctx.lineWidth = 2;
			ctx.strokeText(
				prettyMilliseconds(player.position, { colonNotation: true }),
				365,
				314,
				90
			);
			ctx.shadowBlur = 3;
			ctx.fillStyle = 'white';
			ctx.fillText(
				prettyMilliseconds(player.position, { colonNotation: true }),
				365,
				314,
				90
			);

			//total
			ctx.font = '29px net';
			ctx.shadowColor = 'd3d3d3';
			ctx.shadowBlur = 10;
			ctx.lineWidth = 2;
			ctx.strokeText(
				prettyMilliseconds(song.duration, { colonNotation: true }),
				1000,
				314,
				90
			);
			ctx.shadowBlur = 3;
			ctx.fillStyle = 'white';
			ctx.fillText(
				prettyMilliseconds(song.duration, { colonNotation: true }),
				1000,
				314,
				90
			);

			ctx.font = '34px neet';
			ctx.shadowColor = 'd3d3d3';
			ctx.shadowBlur = 10;
			ctx.lineWidth = 2;
			ctx.strokeText(
				`Requested By: ${song.requester.username}#${
					song.requester.discriminator
				}`,
				370,
				200
			);
			ctx.shadowBlur = 3;
			ctx.fillStyle = 'white';
			ctx.fillText(
				`Requested By: ${song.requester.username}#${
					song.requester.discriminator
				}`,
				370,
				200
			);

			ctx.beginPath();
			ctx.rect(367, 317, 683, 11);
			ctx.fill();

			var grd = ctx.createLinearGradient(370, 320, 680, 335);
			grd.addColorStop(0, 'red');
			grd.addColorStop(1, 'blue');

			ctx.fillStyle = grd;
			ctx.fillRect(370, 320, seek, 7);

			const attachment = new MessageAttachment(
				canvas.toBuffer(),
				'nowPlaying.png'
			);

			message.channel.send(attachment);
		} catch (error) {
			let QueueEmbed = new MessageEmbed()

				.setColor('RANDOM')
				.setDescription(`[${song.title}](${song.uri})`)
				.addField('Requested by', `${song.requester}`, true)
				.addField(
					'Duration',
					`${prettyMilliseconds(player.position, {
						colonNotation: true
					})} / ${prettyMilliseconds(player.queue.current.duration, {
						colonNotation: true
					})}`
				)

				.addField('Make sure i have `Send_Attachments` for the best experience')
				.setThumbnail(player.queue.current.displayThumbnail());
			return message.channel.send(QueueEmbed);
		}
	}
};
