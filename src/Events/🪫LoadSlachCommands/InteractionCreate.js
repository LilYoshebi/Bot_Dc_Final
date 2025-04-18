const { Events } = require('discord.js')

module.exports = {
    name: Events.InteractionCreate,
    async execute (interaction, client) {
        if (interaction.isChatInputCommand()) {
            const slashCommand = client.slashcommands.get(interaction.commandName);
    
            if (!slashCommand) return;
    
            try {
                await slashCommand.execute(interaction, client);
            }catch(e) {
                console.error(e);
            }
        }
    }
}