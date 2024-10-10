const { MessageEmbed } = require('discord.js');
const os = require('os');

module.exports = {
    name: 'status',
    description: 'Affiche le statut actuel du bot',
    devs: false,
    run: async (client, message) => {
        const uptime = client.uptime;
        const uptimeSeconds = Math.floor(uptime / 1000);
        const days = Math.floor(uptimeSeconds / 86400);
        const hours = Math.floor((uptimeSeconds % 86400) / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = uptimeSeconds % 60;

        const embed = new MessageEmbed()
            .setColor('#056dad')
            .setTitle('Statut du bot')
            .addFields(
                { name: 'Uptime', value: `${days}d ${hours}h ${minutes}m ${seconds}s`, inline: true },
                { name: 'Serveurs', value: `${client.guilds.cache.size}`, inline: true },
                { name: 'Utilisateurs', value: `${client.users.cache.size}`, inline: true },
                { name: 'Mémoire utilisée', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`, inline: true },
                { name: 'CPU', value: `${os.cpus()[0].model}`, inline: true },
                { name: 'Architecture', value: `${os.arch()}`, inline: true },
                { name: 'OS', value: `${os.platform()} ${os.release()}`, inline: true }
            )
            .setTimestamp();

        message.channel.send({ embeds: [embed] });
    },
};
