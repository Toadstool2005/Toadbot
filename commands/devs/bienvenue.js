module.exports = {
	name: 'bienvenue',
	description: 'Envoie un message de bienvenue.',
	devs: true,
	run: async (client, message) => {
		client.emit('guildMemberAdd', message.member);
		message.channel.send('Une seconde...');
	},
};