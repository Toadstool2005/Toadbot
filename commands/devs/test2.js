const ProfilSchema = require("../../schemas/profil-Schema");

module.exports = {
  name: 'test2',
  description: 'Met à jour le champ StartGG du profil d\'un utilisateur mentionné',
  devs: false,
  run: async (client, message, args) => {
    // Vérification que la commande utilise bien la mention d'un utilisateur
    const mention = message.mentions.users.first();
    if (!mention) {
      return message.channel.send("Vous devez mentionner un utilisateur pour utiliser cette commande.");
    }

    // Récupération de l'ID de l'utilisateur mentionné
    const userID = mention.id;

    // Vérification de la présence d'une valeur pour Start.GG dans la commande
    const startGGValue = args.slice(1).join(' ');
    if (!startGGValue) {
      return message.channel.send("Vous devez fournir une valeur pour le Start.GG.");
    }

    try {
      // Recherche du profil de l'utilisateur mentionné dans la base de données
      let userProfile = await ProfilSchema.findOne({ userID: userID });

      // Si le profil n'existe pas, on envoie un message d'erreur
      if (!userProfile) {
        return message.channel.send("Profil introuvable pour cet utilisateur.");
      }

      // Mise à jour du champ StartGG avec la nouvelle valeur
      userProfile.StartGG = startGGValue;

      // Sauvegarde du profil mis à jour
      await userProfile.save();

      // Confirmation de la mise à jour
      message.channel.send(`Le profil de ${mention.tag} a été mis à jour avec le Start.GG : ${startGGValue}`);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil :", error);
      message.channel.send("Une erreur est survenue lors de la mise à jour du profil.");
    }
  }
};
