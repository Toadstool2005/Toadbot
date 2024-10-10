module.exports = {
	name: 'bye',
	description: 'emit welcome',
	devs: true,
	run: async (client, message) => {
		client.emit('guildMemberRemove', message.member);
		message.channel.send('Done ...');
	},
};