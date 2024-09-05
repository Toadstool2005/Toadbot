const config = require("../../config.json");
const { MessageEmbed } = require('discord.js');
const humanizeDuration = require("humanize-duration");

module.exports = async (client, member) => {
    try {

        // Définir où le message embed sera envoyé
        const Channel = client.channels.cache.get(config.MembreID);
      
        // Calculer l'ancienneté du compte de l'utilisateur
        const accountAge = Date.now() - member.user.createdTimestamp;

        // Créer le message embed
        const embed = new MessageEmbed()
            .setAuthor({ name : member.user.username, iconURL: member.user.displayAvatarURL({ dynamic: true })})
            .setColor('#056dad')
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text : member.guild.name, iconURL: member.guild.iconURL({ dynamic: true })})
            .setTimestamp()
            .setDescription(`**${member} a quitté ${member.guild.name}**`)
            .addFields(
                {
                    name: "⏰ Compte créé le :",
                    value: `\`\`${member.user.createdAt.toLocaleString()}\`\`\n**${humanizeDuration(accountAge, { round: true, largest: 1 })} ago**`
                },
                {
                    name: `🍄 Nombre de membres dans ${member.guild.name} :`,
                    value: `${member.guild.memberCount}`,
                }
            );

        // Envoie du message dans le salon
        await Channel.send({ embeds: [embed] });

    } catch (error) {
        console.error('Erreur lors du traitement de l\'événement guildMemberRemove :', error);
    }
};
