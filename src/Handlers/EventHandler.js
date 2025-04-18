const fs = require('fs')

module.exports = async (client) => {
    console.log(`
        ╔═══════════════════════════════════════════════╗
        ║                                               ║
        ║   /-/ Events Handler /-/ por LilYoshebi /-/   ║
        ║                                               ║
        ╚═══════════════════════════════════════════════╝`)
    try {
        let nEvents = 0;
        const eventFolder = fs.readdirSync('./src/Events/');
        for (folder of eventFolder) {
            const eventFiles = fs.readdirSync(`./src/Events/${folder}`).filter(files => files.endsWith('.js'));
            for (file of eventFiles) {
                try {
                    const event = require(`../Events/${folder}/${file}`);
                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(...args));
                    } else {
                        client.on(event.name, (...args) => event.execute(...args, client));
                    }
                    console.log(` 🟩 Events - ${file} Cargado.`);
                    nEvents++;
                }catch {
                    console.error(` 🟥 Event - ${file} No Pudo Ser Cargado.`);
                }
            }
        }
        console.log(`${nEvents} Eventos Cargados`);
    } catch(e) {
        console.error(`Fallo En El Event Handler: ${e}`)
    }
}