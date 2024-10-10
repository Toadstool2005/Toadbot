const Timeout = new Set();
const { MessageEmbed } = require('discord.js');
const config = require('../../ressource.json');
const prefix = config.bot.prefix;
const humanizeDuration = require("humanize-duration");

module.exports = async (client, message) => {
    if (message.author.bot) return; // Ignore les messages des bots

    // Gestion des commandes avec préfixe
    if (message.content.toLowerCase().startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();
        const command = client.commands.get(cmd) || client.commands.find(x => x.aliases && x.aliases.includes(cmd));

        if (command) {
            if (command.timeout) {
                const key = `${message.author.id}${command.name}`;
                if (Timeout.has(key)) {
                    const embed = new MessageEmbed()
                        .setTitle('Commande en cooldown')
                        .setDescription(`Vous devez attendre encore ${humanizeDuration(command.timeout)} avant de pouvoir réutiliser cette commande.`)
                        .setColor('#ff0000');
                    return message.channel.send({ embeds: [embed] });
                } else {
                    command.run(client, message, args);
                    Timeout.add(key);
                    setTimeout(() => Timeout.delete(key), command.timeout);
                }
            } else {
                command.run(client, message, args);
            }
        }
    }
};
