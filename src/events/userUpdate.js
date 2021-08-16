
const userSet = require('../../schemas/userschema');
module.exports = async (client, oldUser, newUser) => {

  // Update user in db
  if (oldUser.username != newUser.username || oldUser.discriminator != newUser.discriminator) {
    
 await userSet.findOneAndUpdate({
     user_id: oldUser.id,
 },
 {
    user_name: newUser.username,
    user_discriminator:newUser.discriminator
 })
    client.logger.info(`${oldUser.tag} user tag changed to ${newUser.tag}`);
  }

};
