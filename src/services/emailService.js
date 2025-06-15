const nodemailer = require('nodemailer');
const userRepository = require('../repositories/UserRepository');

let transporter;

async function setupEmail() {
  if (transporter) return;

  let testAccount = await nodemailer.createTestAccount();
  
  console.log('**********************************************');
  console.log('*** Service Email de Développement (Ethereal) ***');
  console.log('**********************************************');
  console.log(`Identifiant: ${testAccount.user}`);
  console.log(`Mot de passe: ${testAccount.pass}`);
  console.log(`Pour voir les emails envoyés, allez sur: ${nodemailer.getTestMessageUrl({})} (ce lien changera à chaque redémarrage)`);
  console.log('**********************************************');


  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, 
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
}

/**
 * Envoie l'email de notification de convention signée.
 * @param {object} convention - L'objet convention complet.
 * @param {Buffer} pdfBuffer - Le PDF à attacher.
 */
async function sendConventionSignedEmail(convention, pdfBuffer) {
  if (!transporter) {
    console.error("Le service d'email n'est pas initialisé. Lancez setupEmail() au démarrage.");
    return;
  }

  // On récupère les emails des participants
  const student = await userRepository.findById(convention.studentId);
  const school = await userRepository.findById(convention.schoolId);
  const company = await userRepository.findById(convention.companyId);

  const recipients = [student.email, school.email, company.email].join(', ');

  const info = await transporter.sendMail({
    from: '"Gestionnaire de Conventions" <no-reply@gestion-stages.com>',
    to: recipients,
    subject: `Votre convention de stage N°${convention.id} est signée !`,
    text: "Bonjour,\n\nVous trouverez en pièce jointe la version finale de votre convention de stage, signée par toutes les parties.\n\nCordialement,\nL'équipe de Gestion de Stages.",
    html: "<p>Bonjour,</p><p>Vous trouverez en pièce jointe la version finale de votre convention de stage, signée par toutes les parties.</p><p>Cordialement,<br>L'équipe de Gestion de Stages.</p>",
    attachments: [
      {
        filename: `convention-${convention.id}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });

  console.log(`Email de convention signée envoyé: ${info.messageId}`);
  // IMPORTANT : Ce lien permet de voir l'email envoyé dans le navigateur
  console.log(`URL de prévisualisation de l'email: ${nodemailer.getTestMessageUrl(info)}`);
}

module.exports = { setupEmail, sendConventionSignedEmail };