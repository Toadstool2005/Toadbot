const { Client, Intents, Collection } = require('discord.js');
const mongoose = require('mongoose');
const Levels = require('discord.js-leveling');
const config = require('./ressource.json');

// Configuration de MongoDB
mongoose.connect(config.bot.mongopath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('Connecté à MongoDB'))
  .catch(err => console.error('Échec de la connexion à MongoDB', err));

// Initialisation de Levels
Levels.setURL(config.bot.mongopath);

// Création et configuration du client Discord
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
        Intents.FLAGS.GUILD_VOICE_STATES,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ],
    partials: [
        'MESSAGE',
        'CHANNEL',
        'REACTION',
        'USER',
        'GUILD_MEMBER'
    ]
});

client.commands = new Collection();
client.slash = new Collection();

// Connexion du client Discord
client.login(config.bot.token);

// Gestion des rejections non gérées
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

// Gestion des commandes, événements et commandes slash
['handlers', 'events', 'slash'].forEach(handler => {
    try {
        require(`./handlers/${handler}`)(client);
    } catch (error) {
        console.error(`Erreur lors du chargement du handler ${handler}:`, error);
    }
});