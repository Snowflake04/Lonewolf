 module.exports = (client, button) => {

 {

 let v =  button.id.split(' ')

    if(v[0] === button.clicker.user.id ||  button.clicker.member.hasPermission('MANAGE_MESSAGES') && v[1] === 'del')

 {

   button.message.delete();

}

   else if(v[1] === 'del')

   button.reply.send("you are not the author of the message or have permission to manage messages. so, **Stay Off**", true);

   

}

}
