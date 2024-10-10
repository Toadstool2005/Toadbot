const OwnerID = ['**id de la princesse**'];

// Attention, cette commande est extrêmement dangereuse, songez à vérifier que seulement vous avez accès à cette commande.

module.exports = {
	name: 'eval',
	description: 'Lance un morceux de code',
	run: async (client, message, args) => {
		if (!OwnerID.includes(message.author.id)) return;
		let codein = args.join(' ');
		try {
			let code = eval(codein);
			if (typeof code !== 'string') code = require('util').inspect(code, { depth: 0 });
			message.channel.send(`\`\`\`js\n${code}\n\`\`\``);
		} catch (e) {
			return message.channel.send(`\`\`\`js\n${e}\n\`\`\``);
		}
	},
};
