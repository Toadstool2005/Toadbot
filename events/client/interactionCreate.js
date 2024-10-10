const Timeout = new Set()
const config = require('../../ressource.json');
const humanizeDuration = require('humanize-duration');

const { MessageEmbed} = require('discord.js');

module.exports = async(client, interaction) => {
    if (interaction.isCommand() || interaction.isContextMenu()) {
		if (!client.slash.has(interaction.commandName)) return;
		if (!interaction.guild) return;
		const command = client.slash.get(interaction.commandName)
		try {
			if (command.timeout) {
				if (Timeout.has(`${interaction.user.id}${command.name}`)) {
					const embed = new MessageEmbed()
					.setColor('056dad')
					.setTitle('Oula, Goomba')
					.setDescription(`Vous devez attendre **${humanizeDuration(command.timeout, { round: true })}** pour réutiliser la commande`)
					.setColor('#ff0000')
					return interaction.reply({ embeds: [embed], ephemeral: true })
				}
			}
			if (command.permissions) {
				if (!interaction.member.permissions.has(command.permissions)) {
					const embed = new MessageEmbed()
					.setColor('056dad')
					.setTitle('Manque de Permission')
					.setDescription(`:x: Tu as besoin de \`${command.permissions}\` pour utiliser la commande.`)
					.setColor('#ff0000')
					.setTimestamp()
					return interaction.reply({ embeds: [embed], ephemeral: true })
				}
			}
			if (command.devs) {
				if (!config.ownersID.includes(interaction.user.id)) {
					return interaction.reply({ content: ":x: Seuls les développeurs peuvent utiliser cette commande", ephemeral: true });
				}
			}
			if (command.ownerOnly) {
				if (interaction.user.id !== interaction.guild.ownerId) {
					return interaction.reply({ content: "Seul le propriétaire de ce serveur peut utiliser cette commande", ephemeral: true })
				}
			}
			command.run(interaction, client);
			Timeout.add(`${interaction.user.id}${command.name}`)
			setTimeout(() => {
				Timeout.delete(`${interaction.user.id}${command.name}`)
			}, command.timeout);
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: ':x: There was an error while executing this command!', ephemeral: true });
		}
	}
	if (interaction.isSelectMenu()) {
		const commandsCustomIDs = [
			"fun_cmd",
			"general_cmd",
			"mod_cmd",
			"monétaire_cmd",
			"level_cmd",
			"profil_cmd",
			"ladder_cmd"
		];
		if (commandsCustomIDs.includes(interaction.customId)) {
			const selectedValues = interaction.values;
			const command = client.slash.find(r => r.name === selectedValues[0]);
			if (selectedValues.includes(command.name)) {
				const embed = new MessageEmbed()
				.setColor('ff0000')
				.setFooter({ text: `Demandé par ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true })})
				if (command.name) {
					embed.setTitle(`Commande : ${command.name}`)
				}
				if (command.description) {
					embed.setDescription(command.description)
				}
				if (command.example) {
					embed.addFields({ name : 'Exemple :', value : command.example.replaceAll('<@>', `<@${interaction.user.id}>`)})
				}
				if (command.usage) {
					embed.addFields({ name :'Usage:', value : command.usage})
				}
				if (command.timeout) {
					embed.addFields({ name :'Timeout:', value : humanizeDuration(command.timeout, { round: true })})
				}
				interaction.reply({
					embeds: [embed],
					ephemeral: true
				});
			}
		}
		if (interaction.customId == 'menu') {
			const perso = interaction.values
			const role = interaction.guild.roles.cache.find(role => role.name === `${perso}`);
			if (!interaction.member.roles.cache.has(role.id)) {
				interaction.member.roles.add(role);
				return interaction.reply({ content: `Le rôle ${role} a été ajouté`, ephemeral: true });
			} else {
				interaction.member.roles.remove(role);
				return interaction.reply({ content: `Le rôle ${role} a été supprimé`, ephemeral: true });
			}
			
		}
	}
	if (interaction.customId === "supprimer") {
		if (interaction.member.roles.cache.has('id du rôle admin')) {
			interaction.reply({ content: 'Le salon est en cours de suppression...' });
			setTimeout(() => {
				interaction.channel.delete();
			}, 5000);
		} else {
			interaction.reply({ content: 'Vous n\'avez pas la permission de supprimer le ticket !', ephemeral: true });
		}
	}
	if (interaction.customId === "fermer") {
		interaction.channel.edit({
			name: '『🍄』Ticket_fermé',
			permissionOverwrites: [{
				id: interaction.user.id,
				deny: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
			},
			{
				id: '1139161902207991878',
				allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
			},
			{
				id: interaction.guild.roles.everyone,
				deny: ['VIEW_CHANNEL'],
			},
			],
		});
		interaction.reply({ content: `Ticket fermé par <@!${interaction.user.id}>` });
	}
}
