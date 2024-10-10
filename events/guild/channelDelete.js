const { MessageEmbed } = require('discord.js');
const config = require("../../config.json");


module.exports = async (client, channel) => {
    try {
        // Récupérer les journaux d’audit pour savoir qui a supprimé le salon
        const auditLogs = await channel.guild.fetchAuditLogs({ type: "CHANNEL_DELETE", limit: 1 });
        const logEntry = auditLogs.entries.first();

        if (!logEntry) {
            return;
        }

        const { executor } = logEntry;

        // Définir où le message embed sera envoyé
        const Channel = client.channels.cache.get(config.ChannelID);

        // Créer le message incorporé
        const embed = new MessageEmbed()
            .setColor('#056dad')
            .setTitle('Un salon a été supprimé.')
            .setAuthor({ name: channel.guild.name, iconURL: channel.guild.iconURL() })
            .setThumbnail(channel.guild.iconURL({ dynamic: true }))
            .addFields(
                { name: '**🍄 Nom du salon :**', value: `${channel.name}` },
                { name: '**:id: ID du salon :**', value: `${channel.id}` },
                { name: '**⚙ Type de salon :**', value: `${channel.type}`, inline: true },
                { name: '**🚨 Modérateur :**', value: `<@${executor.id}> (\`${executor.id}\`)` },
            )
            .setTimestamp()
            .setFooter({ text: executor.username, iconURL: executor.displayAvatarURL({ dynamic: true }) });

        // Envoie du message dans le salon
        await Channel.send({ embeds: [embed] });
    } catch (error) {
        console.error('Une erreur s’est produite lors de la gestion de l’événement de suppression de salon :', error);
    }
};
