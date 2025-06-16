const nodemailer = require('nodemailer');

let transporter;

async function setupEmail() {
  if (transporter) return;
  let testAccount = await nodemailer.createTestAccount();
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email', port: 587, secure: false, 
    auth: { user: testAccount.user, pass: testAccount.pass },
  });
  console.log(`Ethereal Email ready. Preview at: ${nodemailer.getTestMessageUrl({})}`);
}

async function sendStudentInvitationEmail(convention) {
  const completionLink = `http://localhost:5173/complete-student/${convention.studentCompletionToken}`;
  const info = await transporter.sendMail({
    from: '"Gestionnaire de Conventions" <no-reply@gestion-stages.com>',
    to: convention.studentEmail,
    subject: `Action requise pour votre convention de stage`,
    html: `<p>Bonjour,</p><p>Une convention de stage a été initiée pour vous. Veuillez cliquer sur le lien ci-dessous pour compléter vos informations :</p><p><a href="${completionLink}">Compléter ma partie de la convention</a></p>`,
  });
  console.log(`Email d'invitation étudiant envoyé: ${nodemailer.getTestMessageUrl(info)}`);
}

async function sendCompanyInvitationEmail(convention) {
  const completionLink = `http://localhost:5173/complete-company/${convention.companyCompletionToken}`;
  const info = await transporter.sendMail({
    from: '"Gestionnaire de Conventions" <no-reply@gestion-stages.com>',
    to: convention.companyEmail,
    subject: `Demande de convention de stage`,
    html: `<p>Bonjour,</p><p>Une convention de stage vous concernant a été initiée. Veuillez cliquer sur le lien ci-dessous pour vérifier et compléter les informations :</p><p><a href="${completionLink}">Vérifier et compléter la convention</a></p>`,
  });
  console.log(`Email d'invitation entreprise envoyé: ${nodemailer.getTestMessageUrl(info)}`);
}

async function sendFinalConventionEmail(convention, pdfBuffer) {
    // Logique pour envoyer l'email final à toutes les parties...
}

module.exports = { setupEmail, sendStudentInvitationEmail, sendCompanyInvitationEmail, sendFinalConventionEmail };