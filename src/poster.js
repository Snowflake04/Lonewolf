const { AutoPoster } = require('topgg-autoposter');

module.exports = function(client) {
  AutoPoster('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijc5NTk1MjUzMDczNTEwNDAxMCIsImJvdCI6dHJ1ZSwiaWF0IjoxNjI0MTk2MDE2fQ.XSXQZnZBaFAJG4R7dndhlmUVz1X_fd0IG1Uq2gsJpIg',
      client
    )

    .on('posted', () => {
      console.log('Posted stats to Top.gg!');
    });
}