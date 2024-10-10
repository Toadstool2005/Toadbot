const { MessageEmbed } = require('discord.js');
const config = require('../../config.json'); // Fichier de configuration

module.exports = async (client, member) => {
    try {
        // Définir où le message embed sera envoyé
        const Channel = client.channels.cache.get(config.Réception);

        // Création de l'embed d'accueil
        const embed = new MessageEmbed()
            .setColor('#FF4500')
            .setTitle(`<@${member.user.id}> vient de passer par le tuyau !`)
            .setURL('https://www.royaumechampignon.fr/')
            .setAuthor({ name: `${member.guild.name}`, iconURL: member.guild.iconURL({ dynamic: true })})
            .setDescription(`Bienvenue dans le **Royaume Champignon** ! 🏰\nNous sommes ravis de t'accueillir et nous espérons que ce sera le début d'une **superbe aventure** ! 🌟`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: '🌟 Intégration :', value: `N'oublie pas de sélectionner tes rôles dans <#1155735050785144914> et surtout de **lire le règlement** pour être au courant de tout !`, inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'Explorez le Royaume Champignon !', iconURL: 'https://seeklogo.com/images/M/mario-icon-logo-296A6D8DF7-seeklogo.com.png' });

        // Envoie du message dans le salon
        await Channel.send({ embeds: [embed] });

    } catch (error) {
        console.error('Une erreur est survenue lors de l\'accueil d\'un nouveau membre :', error);
    }
};
