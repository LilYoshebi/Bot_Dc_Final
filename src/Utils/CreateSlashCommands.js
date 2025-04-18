const { REST, Routes} = require("discord.js");
const fs = require("fs");
const { token, ClientId, GuildId } = require('../../config.json');

const slachCommands = []

const SlachCommandFolder = fs.readdirSync('./src/SlachCommands');
for (folder of SlachCommandFolder) {
    const SlachCommandFiles = fs.readdirSync(`./src/SlachCommands/${folder}`).filter(files => files.endsWith('.js'));
    try {
        for (file of SlachCommandFiles) {
            const slachCommand = require(`../SlachCommands/${folder}/${file}`);
            slachCommands.push(slachCommand.data.toJSON())
        }
    } catch(e) {
        console.error(`Error Al Cargar El SlachCommand - ${file}`)
    }
    
}
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        const data = await rest.put(Routes.applicationGuildCommands(ClientId, GuildId),{ body: slachCommands });//Solo Para Un Servidor - MODO DEBUGGGGGG
        // const data = await rest.put(Routes.applicationCommands(clientId),{ body:slachCommands });//Para Todos Los Servidores - 
        console.log(`🟩 ${data.length} [SlachCommands] Caragdos Con Exito.`);
    } catch(e) {
        console.error("Error Al Cargar Los Comandos")
    }
})();
