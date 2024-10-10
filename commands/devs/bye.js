module.exports = {
	name: 'bye',
	description: 'Envoie une simulation d\'un Toad quittant le Royaume',
	devs: true,
	run: async (client, message) => {
		client.emit('guildMemberRemove', message.member);
		message.channel.send('Une seconde...');
	},
};
