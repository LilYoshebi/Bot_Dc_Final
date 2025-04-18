const { Client, GatewayIntentBits, Partials, Collection} = require('discord.js');

const fs = require('fs');
const { connectToMongoDB, closeMongoDB, getDb } = require('./Utils/MongoDb.js')




const client = new Client({
    Partials: [ 
        Partials.User,
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
        Partials.GuildMember,
        Partials.ThreadMember,
        Partials.GuildScheduledEvent],
    
    intents:  [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildScheduledEvents
    ]
});

// Se Tiene Que Conectar a MongoDb Y Ejecutar El Map Para Guardar Todas Las key - value/GuildId - Prefix

(async() => {
    const { prefixMap: prefixes, adminMap: admins, colorMap: colors } = await connectToMongoDB();

    // console.log('Mapas cargados:', { prefixMap, adminMap });

    client.slashcommands = new Collection();
    client.commands = new Collection();
    client.aliases = new Collection();
    client.db = getDb().collection('Servidores');
    client.prefix = prefixes;
    client.admin_id = admins;
    client.color = colors;
    let collection = getDb().collection('Default')
    let result = await collection.find().toArray();
    client.token = result[0].Token;
    // client.token = getDb().collection('Servidores').findOne(Token);

    // console.log(client.prefix);
    // console.log(client.admin_id);

    function RequerirHandler() {
        const handlerFolder = fs.readdirSync('./src/Handlers').filter(files => files.endsWith('.js'));
        for (file of handlerFolder) {
            const handler = require(`./Handlers/${file}`)(client)
        }
    }

    //
    RequerirHandler()

    //
    client.login(client.token).catch(() => {console.error("🔑Fallo Con El Token"); process.exit(1);})


})()



// Cerrar la conexión a MongoDB al apagar el bot
process.on('SIGINT', async () => {
    console.log('Apagando el bot...');
    await closeMongoDB();
    process.exit(0);
  });
