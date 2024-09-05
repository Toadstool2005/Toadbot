const { MessageEmbed } = require('discord.js');
const humanizeDuration = require("humanize-duration");
const config = require("../../config.json");

module.exports = async (client, member) => {
    try {
        // Mettre à jour le canal vocal avec le nouveau nombre de membres
        const Channel = client.channels.cache.get(config.MembreID);

        // Calculer l’âge du compte
        const accountAge = Date.now() - member.user.createdTimestamp;

        // Créer le message embed
        const embed = new MessageEmbed()
            .setColor('#056dad')
            .setAuthor({ name: member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true }) })
            .setTimestamp()
            .setDescription(`**${member} a rejoint ${member.guild.name}**`)
            .addFields(
                {
                    name: "⏰ Création du compte:",
                    value: `\`\`${member.user.createdAt.toLocaleString()}\`\`\n**${humanizeDuration(accountAge, { round: true, largest: 1 })}**`
                },
                {
                    name: "🍄 Nombre de population au sein du Serveur :",
                    value: `${member.guild.memberCount}`,
                }
            );

      // Envoie du message dans le salon
      await channel.send({ embeds: [embed] });
        });
    } catch (error) {
        console.error('Erreur de traitement event guildMemberAdd  :', error);
    }
};
