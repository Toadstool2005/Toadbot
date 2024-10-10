const { MessageEmbed } = require('discord.js');

module.exports = async (client, member) => {
    try {
        // Définir où le message embed sera envoyé
        const Channel = client.channels.cache.get(config.Réception);
        // Création de l'embed d'adieu
        const embed = new MessageEmbed()
            .setColor('#056dad')
            .setTitle(`Un Toad vient de s'échapper du Royaume Champignon !`)
            .setAuthor({ name : `${member.guild.name}`, iconURL : member.guild.iconURL({ dynamic: true })})
            .setDescription(`<@${member.user.id}> vient de partir du Royaume Champignon... Quelle tristesse...`)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                { name: 'La peine de mort :', value: `Moi je dis, il faut éliminer ce goomba!`, inline: false },
                { name: 'Le royaume comporte désormais', value: `${member.guild.memberCount} membres.`, inline: false },
            )
            .setTimestamp()
            .setFooter({text : 'Nous vous souhaitons le meilleur dans vos aventures !', iconURL: 'https://www.google.com/url?sa=i&url=https%3A%2F%2Fseeklogo.com%2Fvector-logo%2F482092%2Fmario-icon&psig=AOvVaw3opyeBYA8CAlieYw0mNNR6&ust=1720948725788000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCKj1397Xo4cDFQAAAAAdAAAAABAE'});

        // Envoie du message dans le salon
        await Channel.send({ embeds: [embed] });
    } catch (error) {
        console.error('Une erreur est survenue lors de l\'envoi du message d\'adieu :', error);
    }
};
