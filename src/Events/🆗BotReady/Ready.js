const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log("🟢El Bot esta listo como: ");
    	console.log(`TAG: ${client.user.tag}    -    ID: ${client.user.id}`);
	},
};