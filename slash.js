const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { readdirSync } = require('fs');
const path = require('path');
require('colors');
const config = require('./ressource.json');

const commands = []
readdirSync("./slash/").map(async dir => {
	readdirSync(`./slash/${dir}/`).map(async (cmd) => {
	commands.push(require(path.join(__dirname, `./slash/${dir}/${cmd}`)))
    })
})
const rest = new REST({ version: "9" }).setToken(config.bot.token);

(async () => {
	try {
		console.log('[Discord API] Démarrage de l\'actualisation des commandes d\'application (/).'.yellow);
		await rest.put(
			Routes.applicationCommands(config.bot.botID),
			{ body: commands },
		);
		console.log('[Discord API] Commandes d\'application (/) rechargées avec succès.'.green);
	} catch (error) {
        console.error('Error registering commands:', error);
        // If the error has a response body, log it
        if (error.response && error.response.body) {
            console.error('Response body:', JSON.stringify(error.response.body, null, 2));
        }
    }
})();
