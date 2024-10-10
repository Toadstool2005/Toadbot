module.exports = {
    name: 'list-commands',
    description: 'Affiche toutes les commandes disponibles',
    devs: false,
    run: async (client, message) => {
        const commandNames = client.commands.map(cmd => cmd.name).join(', ');
        message.channel.send(`Commandes disponibles: \`${commandNames}\``);
    },
};