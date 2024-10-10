const config = require("../../config.json");
const { MessageEmbed } = require('discord.js');

module.exports = async (client, ban) => {
    try {
        // Récupérer les logs d'audit pour savoir qui a banni le membre
        const allLogs = await ban.guild.fetchAuditLogs({ type: "MEMBER_BAN_ADD", limit: 1 });
        const fetchModerator = allLogs.entries.first();

        // Définir où le message embed sera envoyé
        const Channel = client.channels.cache.get(config.ModérationID);

        // Créer le message embed
        const embed = new MessageEmbed()
            .setColor('#056dad')
            .setTitle('Un Koopa a été banni !')
            .setAuthor({ name: ban.user.username, iconURL: ban.user.displayAvatarURL({ dynamic: true }) })
            .setDescription(`** <@${ban.user.id}> banni du serveur.**`)
            .setThumbnail(ban.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { 
                    name: '**Raison du ban :**', 
                    value: fetchModerator.reason || 'Pas de raison spécifiée', 
                    inline: true 
                },
                {
                    name: '**🚨 Modérateur :**', 
                    value: `<@${fetchModerator.executor.id}>`, 
                    inline: true 
                }
            )
            .setTimestamp()
            .setFooter({ text: ban.guild.name, iconURL: ban.guild.iconURL({ dynamic: true }) });

        // Envoie du message dans le salon
        await Channel.send({ embeds: [embed] });

    } catch (error) {
        console.error('Une erreur est survenue lors du traitement du banissement d\'un membre :', error);
    }
};
