const fs = require('fs');
const { REST, Routes } = require("discord.js");

module.exports = async (client) => {
    console.log(`
        ╔══════════════════════════════════════════════════════╗
        ║                                                      ║
        ║   /-/ SlashCommands Handler /-/ por LilYoshebi /-/   ║
        ║                                                      ║
        ╚══════════════════════════════════════════════════════╝`)
    try {
        let nSlashCommands = 0;
        const SlashCommandFolder = fs.readdirSync('./src/SlashCommands');
        for (folder of SlashCommandFolder) {
            const SlashCommandFiles = fs.readdirSync(`./src/SlashCommands/${folder}`).filter(files => files.endsWith('.js'));
            try {
                for (file of SlashCommandFiles) {
                    const slashCommand = require(`../SlashCommands/${folder}/${file}`);
                    client.slashcommands.set(slashCommand.data.name, slashCommand);
                }
                console.log(` 🟩 SlashCommands - ${file} Cargado.`);
                nSlashCommands++;
            } catch(e) {
                console.error(` 🟥 SlashCommand - ${file} No Pudo Ser Cargado.` + e);
            }
        }
        console.log(`${nSlashCommands} SlashCommands Cargados`);
    } catch (e) {
        console.error(`Fallo En El SlashCommand Handler: ${e}`)
    }
}