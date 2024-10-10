const Timeout = new Set()
const ProfilSchema = require("../../schemas/profil-Schema");
const RCschema = require("../../schemas/rc_schema");
const config = require('../../ressource.json');
const humanizeDuration = require('humanize-duration');
const PieceSchema = require("../../schemas/pièce-Schema");

const LadderSchema = require("../../schemas/ladder-schema");

const { MessageEmbed, MessageActionRow, MessageButton, TextInputComponent, Modal, MessageSelectMenu, MessageAttachment} = require('discord.js');

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
					return interaction.reply({ content: ":x: Only devs can use this command", ephemeral: true });
				}
			}
			if (command.ownerOnly) {
				if (interaction.user.id !== interaction.guild.ownerId) {
					return interaction.reply({ content: "Only ownership of this server can use this command", ephemeral: true })
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
	if (interaction.isAutocomplete()) {
		const focusedOption = interaction.options.getFocused(true);

		if (focusedOption.name === 'retirer') {
			// Récupérer la liste des personnages de l'utilisateur depuis la base de données
			const user = await ProfilSchema.findOne({ userID: interaction.user.id });
			if (!user || !user.Main || user.Main.length === 0) {
				return interaction.respond([]);
			}

			const choices = user.Main.map(personnage => ({
				name: personnage,
				value: personnage,
			}));

			// Filtrer les choix basés sur la valeur entrée par l'utilisateur dans l'autocomplete
			const filteredChoices = choices.filter(choice =>
				choice.value.toLowerCase().startsWith(focusedOption.value.toLowerCase())
			);

			// Limiter le nombre de choix à afficher (facultatif)
			const limitedChoices = filteredChoices.slice(0, 25);

			// Répondre à l'autocomplete avec les choix filtrés
			return interaction.respond(limitedChoices);
		}

		if (focusedOption.name === 'team-retirer') {
			// Récupérer la liste des équipes de l'utilisateur depuis la base de données
			const user = await ProfilSchema.findOne({ userID: interaction.user.id });
			if (!user || !user.Team || user.Team.length === 0) {
				return interaction.respond([]);
			}

			const choices = user.Team.map(team => ({
				name: team,
				value: team,
			}));

			// Filtrer les choix basés sur la valeur entrée par l'utilisateur dans l'autocomplete
			const filteredChoices = choices.filter(choice =>
				choice.value.toLowerCase().startsWith(focusedOption.value.toLowerCase())
			);

			// Limiter le nombre de choix à afficher (facultatif)
			const limitedChoices = filteredChoices.slice(0, 25);

			// Répondre à l'autocomplete avec les choix filtrés
			return interaction.respond(limitedChoices);
		}

		if (focusedOption.name === 'noteremove') {
			const focusedValue = interaction.options.getFocused();
			const userID = interaction.user.id;
		
			// Chercher l'enregistrement utilisateur
			const userRecord = await RCschema.findOne({ userID });
		
			// Gérer le cas où l'utilisateur n'a pas de profil ou pas de notes
			if (!userRecord || !userRecord.Note || userRecord.Note.length === 0) {
				return interaction.respond([]); // Répondre avec une liste vide si aucune note n'est trouvée
			}
		
			// Filtrer les notes basées sur la saisie de l'utilisateur
			const filteredNotes = userRecord.Note.filter(note => 
				note.toLowerCase().startsWith(focusedValue.toLowerCase())
			);
		
			// Limiter le nombre de suggestions (max 25)
			const suggestions = filteredNotes.slice(0, 25).map(note => ({
				name: note.substring(0, 100), // Limiter la longueur du nom de la note à 100 caractères
				value: note
			}));
		
			// Répondre avec les suggestions filtrées
			return interaction.respond(suggestions);
		}
		

		let choices = []; // Initialisation de la variable choices

		if (focusedOption.name === 'main' || focusedOption.name === 'personnage') {
			choices = ['Mario', 'Link', 'Donkey_Kong', 'Samus', 'Samus_Sombre', 'Yoshi', 'Kirby', 'Fox', 'Pikachu', 'Luigi', 'Ness', 'Captaine_Falcon', 'Rondoudou', 'Peach', 'Daisy', 'Bowser', 'Ice_Clibers', 'Sheik', 'Zelda', 'Kirby', 'Dr_Mario', 'Pichu', 'Falco', 'Marth', 'Lucina', 'Link_Enfant', 'Ganondorf', 'Mewtwo', 'Roy', 'Chrom', 'Mr_Game_Watch', 'Meta_Knight', 'Pit', 'Pit_Maléfique', 'Samus_Sans_', 'Wario', 'Snake', 'Ike', 'Dresseur_Pokemon', 'Diddy_Kong', 'Lucas', 'Sonic', 'Roi_Dadidou', 'Olimar', 'Lucario', 'ROB', 'Link_Cartoon', 'Wolf', 'Villageois', 'Mega_Man', 'Entraineuse_WiiFit', 'Harmonie_Et_Luma', 'Little_Mac', 'Amphinobi', 'Mii_Boxeur', 'Mii_Epeiste', 'Mii_Tireur', 'Palutena', 'Pac-Man', 'Daraen', 'Shulk', 'Bowser_jr', 'Duo_Duck_Hunt', 'Ryu', 'Ken', 'Cloud', 'Corrin', 'Bayonetta', 'Inkling', 'Ridley', 'Simon', 'Richter', 'King_K_Rool', 'Marie', 'Felinferno', 'Plante_Piranha', 'Joker', 'Héros', 'Terry', 'Byleth', 'Min_Min', 'Steve', 'Sephiroth', 'Mythra_Et_Pyra', 'Kazuya', 'Sora', 'Banjo_Kazooie', 'Random'];
		}

		if (focusedOption.name === 'team') {
			choices = ['RC', 'JRC', 'DS', 'SU', 'PW', 'R-B', 'YNK', 'SR', 'KFC', 'KF', 'JRJ', 'GV', 'TAVA', 'CR', "TRL", "KRW", "DnK", "NOX", "OPS", "KnC", "KD", "TZ", "GD", "KnH", "SRBB", "A.R.K.A.D", "TX", "ECR", "3QI", "CEW", "FNPF", "HsR", "ETR", "SA"];
		}

		if (focusedOption.name === 'nom') {
			// Suggestions pour les noms d'utilisateur
			const profiles = await ProfilSchema.find({ Username: { $regex: focusedOption.value, $options: 'i' } }).limit(25);
			const usernames = profiles.map(profile => profile.Username);
			const filteredUsernames = usernames.filter(username =>
				username.toLowerCase().startsWith(focusedOption.value.toLowerCase())
			).slice(0, 25);

			return interaction.respond(filteredUsernames.map(username => ({ name: username, value: username })));
		}

		// Filtrer les choix basés sur la valeur entrée par l'utilisateur dans l'autocomplete
		const filtered = choices.filter(choice =>
			choice.toLowerCase().startsWith(focusedOption.value.toLowerCase())
		);
		const limitedChoices = filtered.slice(0, 25);

		return interaction.respond(
			limitedChoices.map(choice => ({ name: choice, value: choice }))
		);
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
		if (interaction.member.roles.cache.has('1139161902207991878')) {
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
	if (interaction.customId === 'stageban') {
		const ladder = await LadderSchema.findOne({ SalonID: interaction.channel.id });

		if (!ladder) {
			return interaction.reply({ content: 'Aucune partie en cours dans ce salon.', ephemeral: true });
		}

		// Créez une interaction fictive pour la commande /stage
		const fakeInteraction = {
			...interaction,
			commandName: 'stage',
			options: {
			},
			reply: interaction.reply.bind(interaction),
			channel: interaction.channel,
			guild: interaction.guild,
			user: interaction.user,
			client: interaction.client
		};

		// Appelez la fonction de la commande /stage
		const stageCommand = require('../../slash/ladder/stage'); // Assurez-vous que le chemin est correct
		await stageCommand.run(fakeInteraction, client);
	}
	if (interaction.customId == "Choixroles") {
		const { MessageActionRow, MessageSelectMenu } = require('discord.js');

		const row4 = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId('rolechoix')
				.setPlaceholder('Choix des rôles')
				.setMinValues(1)
				.setMaxValues(8) // Permettre la sélection de plusieurs rôles
				.addOptions([
					{
						label: 'Tournoi',
						description: 'Donne l\'accès à la catégorie Tournoi et permet d\'être averti lors des événements',
						emoji: '1168282508819968152',
						value: '846312397445660696',
					},
					{
						label: 'Crew Battle',
						description: 'Donne l\'accès à la catégorie Tournoi et permet d\'être averti lors des Crew Battle',
						emoji: '886256038049882112',
						value: '846312397445660699',
					},
					{
						label: 'Super Smash Bros U.',
						description: 'Permet d\'être averti lorsqu\'un Toad veut jouer !',
						emoji: '886238341488599071',
						value: '846312397445660695',
					},
					{
						label: 'Ladder',
						description: 'Permet de participer au Ladder du Royaume Champignon !',
						emoji: '1069335499866644672',
						value: '1204125845137002556',
					},
					{
						label: 'Live',
						description: 'Permet d\'être averti lors des lives du serveur !',
						emoji: '1073527828781477888',
						value: '846312397445660700',
					},
					{
						label: 'MédiToad',
						description: 'Permet d\'être averti lors des contenus du Royaume Champignon',
						emoji: '886328790756757504',
						value: '1228246638116470796',
					},
					{
						label: 'Yoshi',
						description: 'Ne soyez plus dérangé par le bot pour dormir calmement comme un Yoshi',
						emoji: '1223751060435370136',
						value: 'yoshi',
					},
					{
						label: 'Recrutement RC',
						description: 'Permet d\'être contacté pour le recrutement de la RC.',
						emoji: '1002842679056531456',
						value: '1206348848507654187',
					},
					{
						label: 'Recrutement JRC',
						description: 'Permet d\'être contacté pour le recrutement de la JRC.',
						emoji: '1002842679056531456',
						value: '1206348799287623680',
					},
					{
						label: 'Equipe Toad',
						description: 'Permet de rejoindre l\'équipe des Toads pour combattre les koopas !',
						emoji: '886238341488599071',
						value: '1261735841374539786',
					},
					{
						label: 'Equipe Koopa',
						description: 'Permet de rejoindre l\'équipe des Koopas pour combattre les Toads !',
						emoji: '1000392743056580638',
						value: '1261735985360932906',
					},
				])
		);

		interaction.reply({
			content: "Sélectionnez vos rôles",
			components: [row4],
			ephemeral: true
		});

const filter = (i) => i.customId === 'rolechoix' && i.user.id === interaction.user.id;

const collector = interaction.channel.createMessageComponentCollector({
    filter: filter,
    max: 1,
    componentType: 'SELECT_MENU',
});
collector.on('collect', async (i) => {
    try {
        // On diffère la réponse pour pouvoir utiliser `editReply` et `followUp` plus tard
        await i.deferReply({ ephemeral: true });

        const roles = i.values;

        // Gestion spécifique du rôle "Yoshi"
        if (roles.includes('yoshi')) {
            const user = await PieceSchema.findOne({ userID: i.user.id, guildID: i.guild.id });

            if (user) {
                // Bascule l'état du paramètre Yoshi (true/false)
                user.Yoshi = !user.Yoshi;
                await user.save();
                const message = user.Yoshi 
                    ? 'Vous ne recevez plus les MP du bot.' 
                    : 'Vous recevez désormais les MP du bot.';
                
                // Met à jour la réponse différée
                await i.editReply({ content: message });
            } else {
                return i.editReply({ content: 'Vous devez avoir un compte pour activer la fonction Yoshi ! Faites la commande /quotidien et refaites votre sélection' });
            }

            // Retirer "yoshi" de la liste des rôles à traiter par la suite
            roles.splice(roles.indexOf('yoshi'), 1);
        }

        // S'il reste des rôles à traiter après "yoshi"
        if (roles.length > 0) {
            const member = await i.guild.members.fetch(i.user.id);
            const rolesToAdd = [];
            const rolesToRemove = [];

            // Vérifie chaque rôle sélectionné pour l'ajouter ou le retirer
            roles.forEach(role => {
                if (member.roles.cache.has(role)) {
                    rolesToRemove.push(role);
                } else {
                    rolesToAdd.push(role);
                }
            });

            // Ajoute les nouveaux rôles
            if (rolesToAdd.length > 0) {
                await member.roles.add(rolesToAdd);
            }

            // Retire les anciens rôles
            if (rolesToRemove.length > 0) {
                await member.roles.remove(rolesToRemove);
            }

            // Si "yoshi" était sélectionné et d'autres rôles ont été mis à jour, on envoie un `followUp`
            await i.followUp({ content: 'Vos rôles ont été mis à jour!', ephemeral: true });
        } else {
            // Si seul "yoshi" était sélectionné, pas de `followUp` nécessaire.
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour des rôles:', error);
        await i.editReply({ content: 'Une erreur est survenue lors de la mise à jour de vos rôles.' });
    }

    collector.stop(); // Arrête le collector après le traitement
});




	}
	if (interaction.customId == "Choixjeux") {
		const { MessageActionRow, MessageSelectMenu } = require('discord.js');

		const row4 = new MessageActionRow().addComponents(
			new MessageSelectMenu()
				.setCustomId('rolejeux')
				.setPlaceholder('Choix des jeux')
				.setMinValues(1)
				.setMaxValues(8) // Permettre la sélection de plusieurs rôles
				.addOptions([
					{
						label: 'Mario Kart 8 Deluxe',
						description: 'Permet d\'être notifié lorsqu\'un Toad veut jouer.',
						emoji: '1069335499866644672',
						value: '1275047697463775353',
					},
					{
						label: 'Super Mario Party',
						description: 'Permet d\'être notifié lorsqu\'un Toad veut jouer.',
						emoji: '1166674576126771270',
						value: '1275048177078374503',
					},
					{
						label: 'Super Smash Bros U.',
						description: 'Permet d\'être notifié lorsqu\'un Toad veut jouer.',
						emoji: '886238341488599071',
						value: '846312397445660695',
					},
					{
						label: 'Mario Party Superstars',
						description: 'Permet d\'être notifié lorsqu\'un Toad veut jouer.',
						emoji: '1166674576126771270',
						value: '1275048395337105510',
					},
					{
						label: 'Super Mario Maker 2',
						description: 'Permet d\'être notifié lorsqu\'un Toad veut jouer.',
						emoji: '1073522185714536519',
						value: '1275048904517226614',
					},
					{
						label: 'Mario Tennis Aces',
						description: 'Permet d\'être notifié lorsqu\'un Toad veut jouer.',
						emoji: '886328790756757504',
						value: '1275049810852053014',
					},
					{
						label: 'Super Mario 3D World + Bowser\'s Fury',
						description: 'Permet d\'être notifié lorsqu\'un Toad veut jouer.',
						emoji: '1139980118366900239',
						value: '1275050175295131669',
					},
					{
						label: 'Luigi\'s Mansion 3',
						description: 'Permet d\'être notifié lorsqu\'un Toad veut jouer.',
						emoji: '986592054572384266',
						value: '1275050173596307477',
					},
					{
						label: 'Mario Strikers: Battle League',
						description: 'Permet d\'être notifié lorsqu\'un Toad veut jouer.',
						emoji: '886238341488599071',
						value: '1275051203255861361',
					},
				])
		);

		interaction.reply({
			content: "Sélectionnez vos jeux",
			components: [row4],
			ephemeral: true
		});

const filter = (i) => i.customId === 'rolejeux' && i.user.id === interaction.user.id;

const collector = interaction.channel.createMessageComponentCollector({
    filter: filter,
    max: 1,
    componentType: 'SELECT_MENU',
});

collector.on('collect', async (i) => {
    const roles = i.values;
    try {
        const member = await i.guild.members.fetch(i.user.id);
        const rolesToAdd = [];
        const rolesToRemove = [];

        roles.forEach(role => {
            if (member.roles.cache.has(role)) {
                rolesToRemove.push(role);
            } else {
                rolesToAdd.push(role);
            }
        });

        if (rolesToAdd.length > 0) {
            await member.roles.add(rolesToAdd);
        }
        if (rolesToRemove.length > 0) {
            await member.roles.remove(rolesToRemove);
        }

        await i.reply({ content: 'Vos rôles ont été mis à jour!', ephemeral: true });
    } catch (error) {
        console.error('Erreur lors de la mise à jour des rôles:', error);
        await i.reply({ content: 'Une erreur est survenue lors de la mise à jour de vos rôles.', ephemeral: true });
    }
    collector.stop();
});


	}
	if (interaction.customId === 'shop_1') {
		const user = await PieceSchema.findOne({ userID: interaction.user.id, guildID: interaction.guild.id });
    
		const roles = {
			Donjon: { id: "1165562437299359744", price: 600, duration: 604800000 },
			Mario: { id: "1260894765608861739", price: 1000 },
			Luigi: { id: "1260918008231100446", price: 1000 },
			champiticket: { id: "1238405497728663643", price: 400 },
			Maskass: { id: "1226477475803037797", price: 400 }
		};

		const items = {
			Carapace: { price: 100, description: 'Obtenez une carapace pour vous protéger !' },
			Boo: { price: 150, description: 'Obtenez un Boo pour effrayer vos amis !' },
			Eclair: { price: 300, description: 'Obtenez un éclair pour illuminer vos conversations !' },
			Dé: { price: 50, description: 'Obtenez un dé pour jouer à des jeux !' },
			FleurDeFeu: { price: 400, description: 'Obtiens une fleur de feu pour brûler un item d\'un Toad' },
			FleurDeGlace: { price : 400, description: 'Gèle un Toad de ton choix pour l\'empêcher d\'utiliser le système monétaire'}
		}; 

		const objets = {
			champicouleur: { price: 300, description: 'Ajoutez une couleur spéciale à votre rôle avec le Champi couleur !' },
			icône: { price: 400, description: 'Modifiez ou ajoutez une icône de rôle personnalisée avec l\'icône !' },
			champiboost: { price: 200, description: 'Doubler vos gains d\'expérience pendant 24 h' },
			étoile: { price: 500, duration: 14400000 },
			Nitro: { price: 2500, }
		};

		let xpMultiplier = user.Réduction;

		const handleItem = async (interaction, user, itemName, Réduction) => {
			const itemData = items[itemName];
			const solde = user.Piece - (itemData.price * Réduction);
			if (solde >= 0) {
				user[itemName] += 1;
				user.Piece -= (itemData.price * Réduction);
				await user.save()

				await interaction.reply({ content: `L'item : ${itemName}, a été ajouté avec succès !`, ephemeral: true });
			} else {
				await interaction.reply({ content: `Tu n'as pas assez de pièce !`, ephemeral: true });
			}
		};

		switch (interaction.values[0]) {
			case 'Donjon':
			case 'Mario':
			case 'Luigi':
			case 'champiticket':
				handleRole(interaction, user, interaction.values[0], xpMultiplier);
				break;
			case 'Carapace':
			case 'Boo':
			case 'Eclair':
			case 'Dé':
			case 'FleurDeFeu':
			case 'FleurDeGlace': 
				handleItem(interaction, user, interaction.values[0], xpMultiplier);
				break;
			case 'champicouleur':
				créerrole(interaction.values[0], xpMultiplier);
				break;
			case 'icône':
				handleIcon(interaction, user, xpMultiplier);
				break;
			case 'Maskass':
				handleMaskass(interaction, user, xpMultiplier);
				break;
			case 'champiboost' :
				if (user.piece - (200 * xpMultiplier) >= 0) return interaction.reply({ content: `Vous n'avez pas assez de pièces !`, ephemeral: true });
				user.EffetBoost = 2;
				user.Piece -= (200 * xpMultiplier)
				user.save()
				interaction.reply({ content: `Vos expériences sont maintenant doublées pendant 24 h `, ephemeral: true });
				setTimeout(() => {
					user.EffetBoost = 1;
				}, 86400000);
				break;
			case 'étoile':
				if (user.piece - (400*xpMultiplier) >= 0) return interaction.reply({ content: `Vous n'avez pas assez de pièces !`, ephemeral: true });
				user.Invincible = true;
				user.Piece -= (400 * xpMultiplier)
				user.save()
				interaction.reply({ content: `Vous êtes Invincible pendant 4 h ! `, ephemeral: true });
				setTimeout(() => {
					user.Invincible = false;
				}, 14400000);
				break;
			case 'nitro':
					if (user.piece - (2500*xpMultiplier) >= 0) return interaction.reply({ content: `Vous n'avez pas assez de pièces !`, ephemeral: true });
					user.Piece -= (2500 * xpMultiplier)
					user.save()
					interaction.reply({ content: `Votre article sera bientôt envoyé par un membre du staff. `, ephemeral: true });
					const Channel = client.channels.cache.get('1179425213444784128');
					Channel.send({content: `<@${interaction.user.id}>, vient d'acheter un nitro !`})
					break;
			default:
				interaction.reply({ content: `Option invalide sélectionnée!`, ephemeral: true });
		}

		async function handleRole(interaction, user, value, xpMultiplier) {
			const roleData = roles[value];
			const solde = user.Piece - (roleData.price * xpMultiplier);
				if (solde >= 0) {
					user.Piece -= (roleData.price * xpMultiplier);
					await user.save();
	
					if (roleData.duration) {
						await interaction.member.roles.add(roleData.id);
						setTimeout(() => {
							interaction.member.roles.remove(roleData.id);
						}, roleData.duration);
					} else {
						await interaction.member.roles.add(roleData.id);
					}
	
					await interaction.reply({ content: `Le rôle <@&${roleData.id}> a été ajouté`, ephemeral: true });
				} else {
					await interaction.reply({ content: `Tu n'as pas assez de pièce !`, ephemeral: true });
				}
			
		}
	
		async function handleMaskass(interaction, user, xpMultiplier) {
			const solde = user.Piece - (roles.Maskass.price * xpMultiplier);
			if (solde >= 0) {
				user.Piece -= (roles.Maskass.price * xpMultiplier);

	
				await interaction.reply({ content: 'Mentionnez le Toad que vous souhaitez kidnapper.', ephemeral: true });
	
				const filter = response => response.author.id === interaction.user.id && response.mentions.users.size > 0;
				const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 });
	
				collector.on('collect', async response => {
					const targetUser = response.mentions.users.first();
					const member = interaction.guild.members.cache.get(targetUser.id);
					const cachotRole = roles.Maskass.id;
	
					if (member) {
						await member.roles.set([]);
						await member.roles.add(cachotRole);
						await response.reply({ content: `${targetUser.username} a été kidnappé et envoyé au cachot !` });
						await user.save();
					} else {
						await response.reply({ content: 'Utilisateur introuvable ou non valide.' });
					}
				});
	
				collector.on('end', collected => {
					if (collected.size === 0) {
						interaction.followUp({ content: 'Temps écoulé. Veuillez réessayer.', ephemeral: true });
					}
				});
			} else {
				await interaction.reply({ content: 'Tu n\'as pas assez de pièce !', ephemeral: true });
			}
		}
	
		async function handleIcon(interaction, user, xpMultiplier) {
			const solde = user.Piece - (400 * xpMultiplier);
			if (solde >= 0) {
				const userRole = interaction.guild.roles.cache.find(role => role.name === interaction.user.username);
				if (userRole) {
					user.Piece -= (400 * xpMultiplier);

	
					await interaction.reply({ content: 'Envoyez l\'URL (png|jpg|jpeg|gif) ou l\'emote de l\'icône.', ephemeral: true });
	
					const filter = response => response.author.id === interaction.user.id && (response.content.match(/^https?:\/\/.*\.(?:png|jpg|jpeg|gif)$/i) || response.content.match(/<a?:.+?:\d+>/));
					const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 30000 });
	
					collector.on('collect', async response => {
						let iconUrl = response.content;
	
						const emoteMatch = iconUrl.match(/<a?:.+?:(\d+)>/);
						if (emoteMatch) {
							const emoteId = emoteMatch[1];
							const isAnimated = iconUrl.startsWith('<a:');
							iconUrl = `https://cdn.discordapp.com/emojis/${emoteId}.${isAnimated ? 'gif' : 'png'}`;
						}
	
						try {
							await userRole.setIcon(iconUrl);
							await response.reply({ content: 'Icône mise à jour avec succès !', ephemeral: true });
							await user.save();
						} catch (error) {
							await response.reply({ content: 'Erreur lors de la mise à jour de l\'icône.', ephemeral: true });
						}
					});
				} else {
					await interaction.reply({ content: 'Vous devez d\'abord acheter un rôle personnalisé.', ephemeral: true });
				}
			} else {
				await interaction.reply({ content: 'Tu n\'as pas assez de pièce !', ephemeral: true });
			}
		}
	
		async function créerrole(value, xpMultiplier) {
			const solde = user.Piece - (300 * xpMultiplier);
			if (solde >= 0) {
				user.Piece -= (300 * xpMultiplier);

	
				interaction.guild.roles.create({
					name: `${interaction.user.username}`,
					color: '#d50cfd',
					position: interaction.guild.roles.cache.size - 10
				}).then(async c => {
					interaction.member.roles.add(c);
					interaction.followUp({ content: `Vous avez votre rôle <@&${c.id}>, vous pouvez modifier la couleur avec : /setcolor`, ephemeral: true });
					await user.save();
				});
			} else {
				interaction.followUp({ content: `Tu n'as pas assez de pièce !`, ephemeral: true });
			}
		}
	

	}
}

