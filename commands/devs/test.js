const ProfilSchema = require("../../schemas/profil-Schema");

module.exports = {
  name: 'test',
  description: 'Ajoute les nouvelles lignes aux profils des utilisateurs sans réinitialiser les données existantes',
  devs: false,
  run: async (client, message, args) => {
    try {
      console.log('oui')
      // Récupère tous les profils existants
      const profiles = await ProfilSchema.find({});

      // Parcourt chaque profil
      for (const profile of profiles) {
        // Crée un objet de mise à jour avec les nouvelles lignes et garde les valeurs existantes
        const updatedProfile = {
          parrainage: profile.parrainage || 0, // Ajouter la valeur ou une valeur par défaut
          Badge: profile.Badge || [], // Ajouter un tableau vide si le champ n'existe pas
          Point: profile.Point || 0, // Ajouter avec une valeur par défaut de 0
          Couleur: profile.Couleur || "", // Ajouter une chaîne vide comme valeur par défaut
        };

        // Met à jour le profil avec les nouvelles lignes
        await ProfilSchema.updateOne(
          { userID: profile.userID, guildID: profile.guildID },
          { $set: updatedProfile }
        );

        console.log(`Profil mis à jour pour l'utilisateur ${profile.userID}`);
      }

      // Envoie un message confirmant la mise à jour des profils
      message.reply("Les nouvelles lignes ont été ajoutées avec succès à tous les profils.");

    } catch (err) {
      console.error("Erreur lors de la mise à jour des profils:", err);
      message.reply("Une erreur s'est produite lors de la mise à jour des profils.");
    }
  },
};
