const Timeout = new Set();
const Levels = require("discord.js-leveling");
const { MessageEmbed } = require('discord.js');
const config = require('../../ressource.json');
const prefix = config.bot.prefix;
const humanizeDuration = require("humanize-duration");
const PieceSchema = require("../../schemas/pièce-Schema"); // Schéma des pièces

module.exports = async (client, message) => {
    if (message.author.bot) return; // Ignore les messages des bots

    // Gestion des DM
    if (message.channel.type === 'DM') {
        const targetChannelId = '1236322833798271117';
        const targetChannel = await client.channels.fetch(targetChannelId);

        if (targetChannel.isText()) { // Vérifie si le canal cible est textuel
            const sentMessage = await targetChannel.send(`Message de ${message.author.tag}: ${message.content}`);
            await sentMessage.react('📩');

            // Filtre pour les réactions
            const filter = (reaction, user) => reaction.emoji.name === '📩' && !user.bot;

            try {
                const collected = await sentMessage.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] });
                const reactionUser = collected.first().users.cache.filter(user => !user.bot).first();

                if (reactionUser) {
                    const response = await targetChannel.awaitMessages({ filter: m => m.author.id === reactionUser.id, max: 1, time: 60000 });
                    if (response.size > 0) {
                        message.channel.send(`Réponse de ${reactionUser.tag}: ${response.first().content}`);
                    } else {
                        message.channel.send(`Aucune réponse de ${reactionUser.tag}.`);
                    }
                }
            } catch (error) {
                message.channel.send("Temps écoulé, aucune réaction.");
            }
        }
    }

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

    // Récupération ou création de l'utilisateur dans la base de données
    let user = await PieceSchema.findOne({ userID: message.author.id, guildID: message.guild.id });
    if (!user) {
        user = await PieceSchema.create({
            userID: message.author.id,
            guildID: message.guild.id,
            SuperEtoile: 0,
            SuperPiece: 200,
            Piece: 50,
            FleurDeFeu: 0,
            EffetGlace: 0,
            FleurDeGlace: false,
            EffetEclair: false,
            EffetBoost: 1,
            Réduction: 1,
            Multiplicateur: 1,
            Boo: 0,
            Dé: 0,
            Carapace: 0,
            Eclair: 0,
            Invincible: false,
            lastReward: null, // Format de date actuel
            consecutiveDays: 1,
            Tournoi: 0,
            Yoshi: false,
            items: []
        });
    }

    if (user.EffetGlace === true) return;

    // Attribution des rôles en fonction du niveau
    const assignRolesByLevel = async (userId, guildId, newLevel) => {
        const guild = await client.guilds.fetch(guildId);
        if (!guild) return;

        const member = await guild.members.fetch(userId);
        if (!member) return;

        const rolesByLevel = {
            5: 1.1,
            10: 1.2,
            15: 1.3,
            20: 1.5,
            25: 1.6,
            30: 1.7,
            35: 1.8,
            40: 1.9,
            45: 2
        };

        const roleToAdd = rolesByLevel[newLevel];
        if (roleToAdd) {
            user.Multiplicateur = roleToAdd;
            await user.save();
        }
    };

    // Attribution de pièces en fonction du niveau
    const assignCoinsByLevel = async (userId, guildId, newLevel) => {
        const coinsByLevel = {
            10: 10,
            20: 20,
            30: 30,
            40: 40,
            50: 50
        };

        const coinsToAdd = coinsByLevel[Math.floor(newLevel / 10) * 10] || 50;
        await PieceSchema.updateOne(
            { userID: userId, guildID: guildId },
            { $inc: { Piece: coinsToAdd } }
        );
        return coinsToAdd;
    };

    // Gestion des points d'XP
    const randomAmountOfXp = Math.floor(Math.random() * 10) + 20;
    const adjustedXp = Math.floor(randomAmountOfXp * user.EffetBoost);
    const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, adjustedXp);

    if (hasLeveledUp) {
        const userLevel = await Levels.fetch(message.author.id, message.guild.id);
        await assignRolesByLevel(message.author.id, message.guild.id, userLevel.level);

        const coinsEarned = await assignCoinsByLevel(message.author.id, message.guild.id, userLevel.level);

        const levelEmbed = new MessageEmbed()
            .setTitle('Level up !')
            .setDescription(`Bravo ${message.author} ! Vous êtes maintenant niveau ${userLevel.level}. Vous avez gagné ${coinsEarned} pièces.`);

        if (user.Yoshi  === false) await message.author.send({ embeds: [levelEmbed] });
    }
};
