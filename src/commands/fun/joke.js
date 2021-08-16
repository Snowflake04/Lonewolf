 const Command = require('../Command.js');
  const fetch = require('node-fetch');
  
  
module.exports = class JokeCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'joke',
      description: 'Says one of the legendary joke you will ever hear.\n Warning: Will contain dark jokes if used in NSFW channels',
      type: client.types.FUN,
    });
  }

    async run(message)  {
    
         try {
           message.channel.startTyping();
 
    if (!message.channel.nsfw)
   {
     
    const data = await fetch(`https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,sexist&type=twopart`) ;
    
    const json = await data.json();
   const setup = json.setup;
   const del = json.delivery;
   
    
    message.channel.send(`**${setup}**`)
    .then(message => {
                    setTimeout(function() {
                      
                        message.channel.send(del)
                    }, 4000);
                   
    }
    );
    message.channel.stopTyping();
    }
    
    if (message.channel.nsfw){
    const data = await fetch(`https://v2.jokeapi.dev/joke/Any?type=twopart`);
    
    const json = await data.json();
   const setup = json.setup;
   const del = json.delivery;
    message.channel.send(`**${setup}**`)
    
    .then(msg => {
                    setTimeout(function() {
                        msg.channel.send(del)
                    }, 4000);
    });
    message.channel.stopTyping()
    }
    
         }catch (err){
         console.log(err);
    }
}
};
