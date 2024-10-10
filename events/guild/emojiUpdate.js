const { MessageEmbed } = require('discord.js');
const config = require("../../config.json");

module.exports = async (client, oldEmoji, newEmoji) => {
    try {
        // Définir où le message embed sera envoyé
        const Channel = client.channels.cache.get(config.ModérationID);
        // Récupérer l'auteur de l'emoji mis à jour
        const fetchEmojiAuthor = await newEmoji.fetchAuthor();

        // Vérifier si le nom de l'emoji a été changé
        if (oldEmoji.name === newEmoji.name) return;

        const embed = new MessageEmbed()
        .setColor('#056dad')
        .setThumbnail(newEmoji.url)
        .setTitle('Un emoji a été renommé.')
        .setAuthor({ name: newEmoji.guild.name, iconURL: newEmoji.guild.iconURL({ dynamic: true }) })
        .setTimestamp()
        .setFooter({ text: fetchEmojiAuthor.username, iconURL: fetchEmojiAuthor.displayAvatarURL({ dynamic: true }) })
        .addFields(
            { 
                name: "Ancien nom :", 
                value: oldEmoji.name 
            },
            {
                name: "🆕 Nouveau nom :", 
                value: newEmoji.name, 
                inline: true 
            },
            {
                name: "🚨 Modérateur :", 
                value: `<@${fetchEmojiAuthor.id}>`, 
                inline: true 
            }
        );

        // Envoie du message dans le salon
        await Channel.send({ embeds: [embed] });
    } catch (error) {
        console.error('Une erreur est survenue lors du traitement du renommage de l\'emoji :', error);
    }
};
