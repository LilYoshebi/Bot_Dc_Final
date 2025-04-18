
module.exports = {
    name: "clear",
    aliases: ["cls","clean"],
    description:"Elimina La Cantidad De Mensajes Que Le Pidas. Puedes Usar -h Despues Del Numero De Mensajes Que Quieres Borrar Para Que El Bot No Diga La Cantidad De Mensajes Que A Borrado. Maximos 100 Mensajes Y Que Hayan Sido Enviados 14 Dias Antes Como Maximo.",
    run: async(client, message, args) => {
        try {
          
          if (client.admin_id.get(message.guild.id).length) { // Si no hay admin lo puede hacer cualquiera
            if (!client.admin_id.get(message.guild.id).includes(message.author.id)) return message.reply(`❌ ${message.author} No tienes los permisos necesarios.`) //
          }

          if (args.length === 0) return message.reply("⚠️ Debes proporcionar una cantidad de mensajes a eliminar.");

          const cantidad = parseInt(args[0]);
          
          if (isNaN(cantidad) || !Number.isInteger(cantidad) || cantidad <= 0) {
            return message.reply("⚠️ La cantidad proporcionada no es un número entero válido.");
          }
          
          if (cantidad >= 100) return message.reply("⚠️ Debes proporcionar una cantidad de mensajes inferior o igual a 100.");

          const messages = await message.channel.messages.fetch({ limit: cantidad }); // Extraemos la cantidad que solicitas eliminar como maximo o los que hayan.
          const messageArray = Array.from(messages.values()); // Convertir Collection a array
          let maxDays = Date.now() - 14 * 24 * 60 * 60 * 1000; // 14 Dias Antes en Ms Como Maximo
          const recentMessages = messageArray.filter(msg => msg.createdTimestamp > maxDays);
          if (cantidad > recentMessages.length) return message.reply(`⚠️ Solo Puedes Eliminar Como Maximo ${recentMessages.length} mensajes, Los Demas Son Anteriores a 14 Dias.`)

          message.channel.bulkDelete(cantidad)
            .then(deletedMessages => {
              if (args[1] != "-h"){
                message.channel.send(`Se eliminaron ${deletedMessages.size} mensajes.`);
              }
            })
            .catch(error => {
              console.error('Error al eliminar mensajes:', error);
              message.channel.send('Ocurrió un error al eliminar los mensajes.');
            });
        } catch (e) {
          console.error('Error al ejecutar el comando:', e);
          message.channel.send('Ocurrió un error al ejecutar el comando.');
        }
      }
}