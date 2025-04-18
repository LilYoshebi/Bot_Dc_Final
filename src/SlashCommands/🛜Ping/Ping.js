const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping') // Define el nombre del comando
        .setDescription('Responde con Pong!'), // Define la descripción del comando
    async execute(interaction, client) {
        await interaction.reply(`**¡Pong!** Mi latencia es de **${client.ws.ping}ms **.`);
    },
};