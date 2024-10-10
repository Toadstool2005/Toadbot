const { MessageEmbed } = require('discord.js');
const config = require("../../ressource.json");

module.exports = async (client, ban) => {
    try {
        // Récupérer les logs d'audit pour savoir qui a débanni le membre
        const allLogs = await ban.guild.fetchAuditLogs({ type: "MEMBER_BAN_REMOVE", limit: 1 });
        const fetchModerator = allLogs.entries.first();

        // Définir où le message embed sera envoyé
        const Channel = client.channels.cache.get(config.bot.ModérationID);

        // Créer le message embed
        const embed = new MessageEmbed()
            .setColor('#056dad')
            .setTitle('Un Koopa a été débanni !')
            .setAuthor({ name: ban.guild.name, iconURL: ban.guild.iconURL({ dynamic: true }) })
            .setDescription(`**🍄 <@${ban.user.id}> n'est plus banni du serveur.**`)
            .setThumbnail(ban.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp()
            .setFooter({ text: ban.guild.name, iconURL: ban.guild.iconURL({ dynamic: true }) })
            .addFields(
                {
                    name: "🚨 Modérateur responsable :",
                    value: `<@${fetchModerator.executor.id}>`,
                    inline: true
                },
                {
                    name: "Raison :",
                    value: fetchModerator.reason || 'Pas de raison spécifiée',
                    inline: true
                }
            );

        // Envoie du message dans le salon
        await Channel.send({ embeds: [embed] });

    } catch (error) {
        console.error('Une erreur est survenue lors du traitement du débannissement d\'un membre :', error);
    }
};
