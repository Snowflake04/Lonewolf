const Canvas = require('canvas');
const pms = require('pretty-ms');
const { MessageAttachment } = require('discord.js');

module.exports = {
  async nowPlaying(client, player, track) {
    let channel = client.channels.cache.get(player.textChannel);
    try {
      //custom font
      Canvas.registerFont('data/fonts/Font.otf', { family: 'net' });
      Canvas.registerFont('data/fonts/Aka.ttf', { family: 'neet' });

      const canvas = Canvas.createCanvas(1080, 350);
      //make it "2D"
      const ctx = canvas.getContext('2d');
      //set the Background
      const background = await Canvas.loadImage(track.displayThumbnail());

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
      ctx.drawImage(background, 0, 0, 350, 350);

      ctx.font = '48px neet';
      ctx.shadowColor = 'd3d3d3';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 3;
      ctx.strokeText(`Title: ${track.title}`, 370, 80, 695);
      ctx.shadowBlur = 3;
      ctx.fillStyle = 'white';
      ctx.fillText(`Title: ${track.title}`, 370, 80, 695);

      ctx.font = '36px net';
      ctx.shadowColor = 'd3d3d3';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 2;
      ctx.strokeText(`Author: ${track.author}`, 370, 150, 695);
      ctx.shadowBlur = 3;
      ctx.fillStyle = 'white';
      ctx.fillText(`Author: ${track.author}`, 370, 150, 695);

      ctx.font = '32px net';
      ctx.shadowColor = 'd3d3d3';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 2;
      ctx.strokeText(
        `Duration: ${pms(track.duration, { colonNotation: true })} min`,
        370,
        200,
        695
      );
      ctx.shadowBlur = 3;
      ctx.fillStyle = 'white';
      ctx.fillText(
        `Duration: ${pms(track.duration, { colonNotation: true })} min`,
        370,
        200,
        695
      );

      ctx.shadowColor = 'd3d3d3';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 2;
      ctx.strokeText('Source: YouTube', 370, 250);
      ctx.shadowBlur = 3;
      ctx.fillStyle = 'white';
      ctx.fillText('Source: YouTube', 370, 250);

      ctx.font = '34px neet';
      ctx.shadowColor = 'd3d3d3';
      ctx.shadowBlur = 10;
      ctx.lineWidth = 2;
      ctx.strokeText(
        `Requested By: ${track.requester.username}#${
					track.requester.discriminator
				}`,
        370,
        296
      );
      ctx.shadowBlur = 3;
      ctx.fillStyle = 'white';
      ctx.fillText(
        `Requested By: ${track.requester.username}#${
					track.requester.discriminator
				}`,
        370,
        296
      );

      const attachment = new MessageAttachment(
        canvas.toBuffer(),
        'Playing.png'
      );

      channel.send({ files: [attachment] });
    } catch (error) {
      message.channel.send(
        `Started playing: ${
					track.title
				} \n Make sure i have SEND_ATTACHMEMTS permission for better experience`
      );
    }
  }
};