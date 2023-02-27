const { Events } = require('discord.js');

module.exports = {
	name: Events.MessageCreate,
	execute(message) {
		console.log(message);

        if (message.attachments) {
            console.log(message.attachments);
        }
 
        if (message.embeds){
            if(message.embeds.length > 0){
                console.log(message.embeds);
            }

        }

	},
};