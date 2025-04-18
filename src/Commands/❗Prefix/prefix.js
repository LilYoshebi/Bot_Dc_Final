const { updateMongoDB } = require('../../Utils/MongoDb.js')

module.exports = {
    name: "prefix",
    aliases: ["prefijo", "cambiarprefijo", "cambiarprefix", "changeprefix"],
    description: "Sirve para cambiar el Prefijo del Bot en el Servidor",
    run: async (client, message, args) =>{

        if (client.admin_id.get(message.guild.id).length) { // Si no hay admin lo puede hacer cualquiera
            if (!client.admin_id.get(message.guild.id).includes(message.author.id)) return message.reply(`❌ ${message.author} No tienes los permisos necesarios.`) //
        }

        if(!args[0]) return message.reply(`❌ ${message.author} Tienes que poner un argumento`)

        if (args[0] === client.prefix.get(message.guild.id)) return message.reply(`❌ ${message.author} Ese es el prefijo actual`)

            let ok = await updateMongoDB('prefix', message.guild.id, args[0]); // Actualizamos El Prefijo En MongoDb

            if (ok.modifiedCount > 0) {
                client.prefix.set(message.guild.id, args[0]); // Actualizamos El Prefijo En Local
                message.reply(`El prefijo del Bot ${client.user.tag} ha sido modificado por ${message.author} y ahora es **${client.prefix.get(message.guild.id)}**`);
            }else {
                message.reply(`Ocurrió un error al cambiar el prefijo ${client.prefix.get(message.guild.id)}`)
            }
    }
}