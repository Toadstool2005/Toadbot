const { MessageEmbed } = require('discord.js');
const config = require('../../config.json'); // Fichier de configuration

module.exports = async (client, guild) => {
    try {
        // Récupérer le serveur centralisé et le canal de notification
        const Channel = client.channels.cache.get(config.ModérationID);

        // Créer un embed de notification
        const embed = new MessageEmbed()
            .setColor('#ff0000')
            .setTitle(`Au revoir ${guild.name} !`)
            .setDescription(`Le bot a été retiré du serveur ${guild.name}.`)
            .setThumbnail(guild.iconURL({ dynamic: true }))
            .setTimestamp()
            .setFooter({ text : `Bot retiré de ${guild.name}`, iconURL: client.user.displayAvatarURL()});

        // Envoyer l'embed dans le canal de notification du serveur centralisé
        await Channel.send({ embeds: [embed] });
    } catch (error) {
        console.error('Une erreur est survenue lors du retrait du bot d\'un serveur :', error);
    }
};
