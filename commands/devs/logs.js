const fs = require('fs');
const config = require('../../ressource.json');

module.exports = {
    name: 'logs',
    description: 'Activer les logs dans un canal spécifique',
    devs: false,
    run: async (client, message, args) => {
        const logChannel = message.mentions.channels.first();

        if (!logChannel) {
            return message.channel.send('Veuillez mentionner un canal pour les logs.');
        }

        // Enregistrez le canal de logs dans une base de données ou un fichier de configuration
        // Ici, on utilise un fichier de configuration pour la simplicité

        config.logChannel = logChannel.id;
        fs.writeFileSync('../../ressource.json', JSON.stringify(config, null, 2));

        message.channel.send(`Logs activés dans le canal ${logChannel}.`);

        // Event listener pour les logs
        client.on('guildMemberAdd', member => {
            const logChannel = client.channels.cache.get(config.logChannel);
            if (logChannel) logChannel.send(`:inbox_tray: ${member.user.tag} a rejoint le serveur.`);
        });

        client.on('guildMemberRemove', member => {
            const logChannel = client.channels.cache.get(config.logChannel);
            if (logChannel) logChannel.send(`:outbox_tray: ${member.user.tag} a quitté le serveur.`);
        });

        client.on('messageDelete', message => {
            const logChannel = client.channels.cache.get(config.logChannel);
            if (logChannel) logChannel.send(`:wastebasket: Un message de ${message.author.tag} a été supprimé dans ${message.channel}: "${message.content}"`);
        });

        client.on('messageUpdate', (oldMessage, newMessage) => {
            if (oldMessage.content === newMessage.content) return;
            const logChannel = client.channels.cache.get(config.logChannel);
            if (logChannel) logChannel.send(`:pencil2: Un message de ${oldMessage.author.tag} a été modifié dans ${oldMessage.channel}\n**Avant**: "${oldMessage.content}"\n**Après**: "${newMessage.content}"`);
        });
    },
};
