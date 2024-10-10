const { MessageEmbed } = require('discord.js');
const config = require("../../config.json");

module.exports = async (client, emoji) => {
    try {
        // Définir où le message embed sera envoyé
        const Channel = client.channels.cache.get(config.ModérationID);

        const fetchEmojiAuthor = await emoji.fetchAuthor();
        const embed = new MessageEmbed()
            .setAuthor({ name: emoji.guild.name, iconURL: emoji.guild.iconURL() })
            .setColor('#056dad')
            .setTitle('Emoji créé.')
            .setDescription(`**🍄 ${fetchEmojiAuthor} a créé <:${emoji.name}:${emoji.id}> !**`)
            .setThumbnail(emoji.url)
            .setFooter({ text: fetchEmojiAuthor.username, iconURL: fetchEmojiAuthor.displayAvatarURL({ dynamic: true }) })
            .setTimestamp()
            .addFields(
                { name: "🚨 Modérateur :", value: `<@${fetchEmojiAuthor.id}>` }
            );

            // Envoie du message dans le salon
        await Channel.send({ embeds: [embed] });
    } catch (error) {
        console.error('Une erreur est survenue lors du traitement de la création de l\'emoji :', error);
    }
};
