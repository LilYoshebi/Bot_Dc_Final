const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        try {
            const prefix = client.prefix.get(message.guild.id);

            if (!message.content.startsWith(prefix) || message.author.bot) return;
            const args = message.content.slice(prefix.length).trim().split(/ +/);
            const command = args.shift().toLocaleLowerCase()
    
            const cmd = client.commands.get(command) || client.commands.find(c => c.aliases && c.aliases.includes(command));

            if (cmd) {
                cmd.run(client, message, args);
            }

        }catch(e) {
            console.error(e)
        }
    }
}