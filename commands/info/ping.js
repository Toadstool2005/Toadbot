module.exports = {
    name: 'ping',
    description: 'Répond avec Pong! et affiche la latence.',
    devs: false,
    run: async (client, message) => {
        const msg = await message.channel.send('Pinging...');
        const latency = msg.createdTimestamp - message.createdTimestamp;
        const apiLatency = Math.round(client.ws.ping);

        msg.edit(`Pong! La latence est ${latency}ms. La latence de l’API est ${apiLatency}ms`);
    },
};