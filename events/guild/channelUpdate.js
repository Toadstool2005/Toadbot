const { MessageEmbed } = require('discord.js');
const config = require("../../config.json");

module.exports = async (client, oldChannel, newChannel) => {
    try {
        // Récupérer les logs d'audit pour savoir qui a modifié le salon
        const auditLogs = await newChannel.guild.fetchAuditLogs({ type: "CHANNEL_UPDATE", limit: 1 });
        const logEntry = auditLogs.entries.first();

        if (!logEntry) {
            return;
        }

        // Définir où le message embed sera envoyé
        const Channel = client.channels.cache.get(config.ChannelID);

        const { executor } = logEntry;

        // Créer le message embed
        const embed = new MessageEmbed()
            .setColor('#056dad')
            .setTitle(`Le salon ${newChannel.name} a été modifié.`)
            .setAuthor({ name: newChannel.guild.name, iconURL: newChannel.guild.iconURL() })
            .setThumbnail(newChannel.guild.iconURL({ dynamic: true }))
            .addFields(
                { name: '**🆕 Nouveau nom :**', value: `${newChannel.name}`, inline: true },
                { name: '**Ancien nom :**', value: `${oldChannel.name}`, inline: true },
                { name: '**:id: ID du salon :**', value: `${newChannel.id}` },
                { name: '**⚙ Type de salon :**', value: `${newChannel.type}`, inline: true },
                { name: '**🚨 Modérateur :**', value: `<@${executor.id}> (\`${executor.id}\`)`, inline: true },
            )
            .setTimestamp()
            .setFooter({ text: executor.username, iconURL: executor.displayAvatarURL({ dynamic: true }) });

        // Vérifier les changements de permissions
        const oldPermissions = oldChannel.permissionOverwrites.cache;
        const newPermissions = newChannel.permissionOverwrites.cache;

        if (!oldPermissions.equals(newPermissions)) {
            const changes = [];

            newPermissions.forEach((newPerm, id) => {
                const oldPerm = oldPermissions.get(id);
                if (!oldPerm || !oldPerm.allow.equals(newPerm.allow) || !oldPerm.deny.equals(newPerm.deny)) {
                    changes.push(`Les permissions pour <@&${id}> ou <@${id}> ont changé.`);
                }
            });

            if (changes.length > 0) {
                embed.addFields({ name : '**🔧 Permissions modifiées :**', value : changes.join('\n')});
            }
        }

        // Envoie du message dans le salon
        await Channel.send({ embeds: [embed] });
    } catch (error) {
        console.error('Une erreur est survenue lors du traitement de l\'événement de mise à jour du salon :', error);
    }
};
