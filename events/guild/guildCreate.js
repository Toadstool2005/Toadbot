const { MessageEmbed } = require('discord.js');

module.exports = async (client, guild) => {
    try {
        // Récupérer tous les canaux de texte du serveur
        const textChannels = guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT');

        // Trouver le premier canal texte disponible
        const firstTextChannel = textChannels.first();

        if (firstTextChannel) {
            // Créer un embed de bienvenue
            const embed = new MessageEmbed()
                .setColor('#0099ff')
                .setTitle(`Bienvenue sur ${guild.name} !`)
                .setDescription(`Hey, je suis Toad et je viens directement du Royaume Champignon pour vous servir ! Merci de m'avoir ajouté, j'espère ne pas vous décevoir ! Pour me configurer, utilisez la commande /config.`)
                .setThumbnail(guild.iconURL({ dynamic: true }))
                .setTimestamp()
                .setFooter({text : `Bot ajouté à ${guild.name}`, iconURL: client.user.displayAvatarURL()});

            // Envoyer l'embed dans le premier canal texte trouvé
            await firstTextChannel.send({ embeds: [embed] });
        }
    } catch (error) {
        console.error('Une erreur est survenue lors de l\'ajout du bot à un serveur :', error);
    }
};
