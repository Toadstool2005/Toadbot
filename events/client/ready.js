module.exports = async (client, guild) => {
    client.user.setActivity('Le Royaume Champignon', { type: 'LISTENING' });
    console.log(`[Discord API] Connecté en tant que ${client.user.username}`.magenta);

    client.guilds.cache.forEach(async (guild) => {
        try {
            await guild.members.fetch(); // Mettre en cache tous les membres de la guild
            console.log(`Tous les membres de ${guild.name} ont été mis en cache.`);
        } catch (error) {
            console.error(`Erreur lors de la mise en cache des membres de ${guild.name}:`, error);
        }
    });

};
