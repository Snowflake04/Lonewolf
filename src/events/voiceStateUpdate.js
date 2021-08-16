module.exports = (client, oldState, newState) => {
  
  // Check member
  if (oldState.member != newState.member) return;
  const member = newState.member;
  
  // Set IDs
  const oldId = oldState.channelID;
  const newId = newState.channelID;
  const afkId = member.guild.afkChannelID;

  if (oldId === newId) return;
  else if ((!oldId || oldId === afkId) && newId && newId !== afkId) { // Joining channel that is not AFK
console.log("member joined a Voice Channel")
  } else if (oldId && (oldId !== afkId && !newId || newId === afkId)) { // 
  console.log("member left")
  //Leaving voice chat or joining AFK
    clearInterval(member.interval);
  }
};