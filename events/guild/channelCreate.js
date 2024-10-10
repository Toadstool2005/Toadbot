const { MessageEmbed } = require('discord.js');
const config = require("../../config.json");

module.exports = async (client, channel) => {
    try {
        // Fetch the audit logs to find out who created the channel
        const auditLogs = await channel.guild.fetchAuditLogs({ type: "CHANNEL_CREATE", limit: 1 });
        const logEntry = auditLogs.entries.first();

        if (!logEntry) {
            return;
        }

        const { executor } = logEntry;

        // Définir où le message embed sera envoyé
        const Channel = client.channels.cache.get(config.ChannelID);

        // Create the embed message
        const embed = new MessageEmbed()
            .setColor('#056dad')
            .setTitle('Nouveau Salon a été créé')
            .setAuthor({ name: channel.guild.name, iconURL: channel.guild.iconURL() })
            .setThumbnail(channel.guild.iconURL({ dynamic: true }))
            .addFields(
                { name: '**🍄 Nom du salon :**', value: `<#${channel.id}>` },
                { name: '**:id: ID du salon :**', value: `${channel.id}` },
                { name: '**⚙ Type de salon :**', value: `${channel.type}` },
                { name: '**🚨 Modérateur :**', value: `<@${executor.id}> (\`${executor.id}\`)` },
            )
            .setTimestamp()
            .setFooter({ text: executor.username, iconURL: executor.displayAvatarURL({ dynamic: true }) });

        // Envoie du message dans le salon
        await Channel.send({ embeds: [embed] });
      
    } catch (error) {
        console.error('Une erreur s’est produite lors de la gestion de l’événement de création de salonS :', error);
    }
};
