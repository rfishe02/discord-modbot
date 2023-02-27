const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	execute(message) {
		//console.log(message);

        if (message.attachments) {
            
            message.attachments.forEach(function (attachment){
                console.log(attachment)
            })        

        }
 
        if (message.embeds){
            if(message.embeds.length > 0){
                console.log(message.embeds);
            }

        }

	},
};