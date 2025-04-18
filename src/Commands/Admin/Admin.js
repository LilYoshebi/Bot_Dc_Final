const { updateMongoDB } = require('../../Utils/MongoDb.js');

module.exports ={
    name: "admin",
    aliases: ["admin"],
    description: "Establece Un admin",
    run: async (client, message, args) => {
        
        if (client.admin_id.get(message.guild.id).length) { // Si no hay admin lo puede hacer cualquiera
            if (!client.admin_id.get(message.guild.id).includes(message.author.id)) return message.reply(`❌ ${message.author} No tienes los permisos necesarios.`) //
        }

        if(!args[0]) return message.reply(`❌ ${message.author} Tienes que poner un argumento`)
        
        let users;
        const usersId = [];
        let result;
        let old_admin_id = client.admin_id

        if (args[0] === "add" || args[0] === "+" || args[0] === "delete" || args[0] === "-") {
            if (message.mentions) {
                users = message.mentions.users;
                users.forEach((user) => {
                    if (client.admin_id.get(message.guild.id).includes(user.id) && (args[0] === "add" || args[0] === "+")) {
                        usersId.push(user.id);
                        return message.reply(`⚠️ <@${user.id}> Ya es admin`)
                    }

                    if (!client.admin_id.get(message.guild.id).includes(user.id) && (args[0] === "delete" || args[0] === "-")){
                        usersId.push(user.id)
                        return message.reply(`⚠️ <@${user.id}> No es admin`)
                    }


                });
            }


            if (usersId.length){
                if (args[0] === "add" || args[0] === "+") {
                    result = await updateMongoDB('admin+', message.guild.id, usersId);
                    usersId.forEach(id => client.admin_id.get(message.guild.id).push(id))
                }
        
                if (args[0] === "delete" || args[0] === "-") {
                    result = await updateMongoDB('admin-', message.guild.id, usersId);
                    usersId.forEach(id => client.admin_id.get(message.guild.id).splice(client.admin_id.indexOf(id)));
                }

                if (result.modifiedCount || result.insertedId || result.deletedCount) {
                    if (args[0] === "add" || args[0] === "+"){
                        let newAdmins = client.admin_id.get(message.guild.id).forEach(admin => !old_admin_id.includes(admin));
                        message.reply(`${newAdmins.forEach(admin => `<@${admin}>`)} Ahora son Admins`);
                    }

                    if (args[0] === "delete" || args[0] === "-") {
                        let oldAdmins = old_admin_id.forEach(admin => !client.admin_id.get(message.guild.id).includes(admin))
                        message.reply(`${oldAdmins.forEach(admin => `<@${admin}>`)} Ya no son Admins`);
                    }
                }
            }
        }        
    }
}