const fs = require('fs')

module.exports = async(client) => {
    console.log(`
        ╔═════════════════════════════════════════════════╗
        ║                                                 ║
        ║   /-/ Commands Handler /-/ por LilYoshebi /-/   ║
        ║                                                 ║
        ╚═════════════════════════════════════════════════╝`)
    try{
        let nCommands = 0;
        const commandFolder = fs.readdirSync('./src/Commands');
        for (folder of commandFolder) {
            const commandFiles = fs.readdirSync(`./src/Commands/${folder}`).filter(files => files.endsWith('.js'));
            try{
                for (file of commandFiles) {
                    const command = require(`../Commands/${folder}/${file}`);
                    client.commands.set(command.name, command);
                    if (command.aliases && Array.isArray(command.aliases)) command.aliases.forEach((alias) => client.aliases.set(alias, command.name));
                    console.log(` 🟩 Comando - ${file} Cargado.`);
                    nCommands++
                }
            } catch(e) {
                console.log(` 🟥 Comando - ${file} No Pudo Ser Cargado.`, e);
            }
        }
        console.log(`${nCommands} Comandos Cargados`);
    } catch(e) {
        console.error(`Fallo En El Event Handler: ${e}`)
    }
}