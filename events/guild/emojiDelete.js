const { MessageEmbed } = require('discord.js');
const config = require("../../config.json");

module.exports = async (client, emoji) => {
    try {
        // Récupérer les logs d'audit pour savoir qui a supprimé l'emoji
        const auditLogs = await emoji.guild.fetchAuditLogs({ type: "EMOJI_DELETE", limit: 1 });
        const logEntry = auditLogs.entries.first();

        if (!logEntry) {
            return;
        }

        const { executor } = logEntry;

        // Définir où le message embed sera envoyé
        const Channel = client.channels.cache.get(config.ModérationID);

        // Créer le message embed
        const embed = new MessageEmbed()
            .setAuthor({ name: emoji.guild.name, iconURL: emoji.guild.iconURL() })
            .setColor('#056dad')
            .setTitle('Emoji supprimé.')
            .setDescription(`**🍄 : <@${executor.id}> a supprimé ${emoji.name} !**`)
            .setThumbnail(emoji.url)
            .setTimestamp()
            .addFields({ 
                name: '**🚨 Modérateur :**', 
                value: `<@${executor.id}> (\`${executor.id}\`)`, 
                inline: true 
            });

        // Envoie du message dans le salon
        await Channel.send({ embeds: [embed] });
    } catch (error) {
        console.error('Une erreur est survenue lors du traitement de la suppression de l\'emoji :', error);
    }
};
