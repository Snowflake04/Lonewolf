const { AutoPoster } = require('topgg-autoposter');
const config = require("../config.json");

module.exports = function(client) {
  AutoPoster(config.topgg,
      client
    )

    .on('posted', () => {
      console.log('Posted stats to Top.gg!');
    });
}
