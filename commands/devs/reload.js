const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'reload',
    description: 'Recharge une commande',
    devs: true,
    run: async (client, message, args) => {
        if (!args.length) return message.channel.send(`Vous devez fournir le nom d'une commande pour la recharger !`);

        const commandName = args[0].toLowerCase();
        const command = client.commands.get(commandName);

        if (!command) return message.channel.send(`Il n'y a aucune commande avec ce nom ou alias \`${commandName}\` !`);

        const commandPath = path.join(__dirname, `${command.name}.js`);

        try {
            delete require.cache[require.resolve(commandPath)];
            const newCommand = require(commandPath);
            client.commands.set(newCommand.name, newCommand);
            message.channel.send(`Commande \`${command.name}\` rechargée avec succès !`);
        } catch (error) {
            console.error(error);
            message.channel.send(`Erreur lors du rechargement de la commande \`${command.name}\`:\n\`${error.message}\``);
        }
    },
};
