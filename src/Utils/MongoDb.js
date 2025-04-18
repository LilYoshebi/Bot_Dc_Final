const { MongoClient, ServerApiVersion } = require('mongodb');
const { DbUser, DbPassword } = require('../../config.json');

const uri = `mongodb+srv://${DbUser}:${DbPassword}@definitivebot.fhxyg6d.mongodb.net/?appName=DefinitiveBot`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1, // Versión estable de la API
        strict: true, // Rechaza comandos no soportados
        deprecationErrors: true // Muestra errores si usas funciones obsoletas
    }
});

let db;

async function connectToMongoDB() {
    console.log(`
        ╔═══════════════════════════════════════════════════╗
        ║                                                   ║
        ║   /-/ MongoDb Connection /-/ por LilYoshebi /-/   ║
        ║                                                   ║
        ╚═══════════════════════════════════════════════════╝`)
    try{
    console.log('❓ Intentando conectar a MongoDB Atlas...');
      await client.connect();
    console.log('🟩 Conexión establecida!');

    db = client.db('DefinitiveBot');
    console.log('🟩 Base de datos seleccionada:', db.databaseName);

    const collection = db.collection('Servidores');

    const servers = await collection.find().toArray();
    // console.log('Servers encontrado:', servers);

    let prefixMap = new Map()
    let adminMap = new Map()
    let colorMap = new Map()
    for (server of servers) {
        prefixMap.set(server.GuildId,server.Data.Prefix); //Guardamos Los Prefijos Que Se utilizan En Cada Servidor
        adminMap.set(server.GuildId,server.Data.AdminsId); //Guardamos Los Admins Que Hay En Cada Servidor
        colorMap.set(server.GuildId,server.Data.Color); // Guardamos El Color Que Se Va A Usar En Los Embeds
    }

    return { prefixMap, adminMap, colorMap }; // Devolver los mapas
    } catch(error) {
    console.error('🟥 Error al conectar:', error.message);
      if (error.code === 8000) {
          console.error('🟥 Autenticación fallida. Verifica usuario, contraseña y configuración en Atlas.');
      }
      throw error;
    }
}

async function updateMongoDB(Accion, ServerId, arg){
    try{
        const collection = db.collection('Servidores');
        let result;
        if (Accion === 'prefix') {
            let prefix = arg;
            result = await collection.updateOne({ GuildId: `${ServerId}` }, { $set: { "Data.Prefix":`${prefix}` } });
            return result;
        }

        if (Accion === 'admin+' || Accion === 'admin-') {
            let id = arg;
            if (Accion === 'admin+') {
                console.log(3)
                result = await collection.updateOne({ GuildId: `${ServerId}` }, { $addToSet: { "Data.AdminsId": {$each: id } } });
                console.log(4)
            }

            if (Accion === 'admin-') {
                console.log(5)
                result = await collection.updateOne({ GuildId: `${ServerId}` }, { $pull: { "Data.AdminsId": {$in: id} } });
                console.log(6)
            }

        }

        if (Accion === 'color') {
            let color = arg;
            result = await collection.updateOne({ GuildId: `${ServerId}` }, { $set: { "Data.Color":`${color}`} });
        }
        console.log('Documentos actualizados:', result.modifiedCount);
        console.log('Documentos creados:', result.upsertedCount);
        console.log('Documentos eliminados:', result.deletedCount);
        return result;
    } catch(error) {
        return 0;
    }
}

async function closeMongoDB() {
    try {
      await client.close();
      console.log('Conexión cerrada');
    } catch (e) {
      console.error('Error al cerrar la conexión:', e);
    }
  }


module.exports = { connectToMongoDB, updateMongoDB, closeMongoDB, getDb:() => db }; // Exportar la función