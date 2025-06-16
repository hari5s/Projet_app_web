const { v4: uuidv4 } = require('uuid');
const conventionRepository = require('../repositories/conventionRepository');
const userRepository = require('../repositories/UserRepository');
const { sendStudentInvitationEmail, sendCompanyInvitationEmail, sendFinalConventionEmail } = require('./emailService');
const { generateConventionPdf } = require('./pdfService');


async function createConventionBySchool(schoolId, data) {
  const studentToken = uuidv4();
  const newConvention = await conventionRepository.create({ ...data, schoolId, studentCompletionToken: studentToken });
  await sendStudentInvitationEmail(newConvention);
  return newConvention;
}

async function getConventionByToken(token, type) {
    if (type === 'student') return await conventionRepository.findByStudentCompletionToken(token);
    if (type === 'company') return await conventionRepository.findByCompanyCompletionToken(token);
    return null;
}

async function completeByStudent(token, data) {
  const convention = await getConventionByToken(token, 'student');
  if (!convention || convention.status !== 'En attente Etudiant') throw new Error('Lien invalide.');
  
  const { firstName, lastName, phoneNumber, password, companyEmail } = data;
  let student = await userRepository.findByEmail(convention.studentEmail);
  if (!student) {
    student = await userRepository.create({ email: convention.studentEmail, password, role: 'Student', firstName, lastName, phoneNumber });
  }

  const companyToken = uuidv4();
  const updatedData = {
    studentId: student.id, studentFirstName: firstName, studentLastName: lastName, studentPhone: phoneNumber,
    companyEmail, companyCompletionToken: companyToken, status: 'En attente Entreprise',
  };
  const updatedConvention = await conventionRepository.update(convention.id, updatedData);
  await sendCompanyInvitationEmail(updatedConvention);
  return updatedConvention;
}

async function completeByCompany(token, data) {
    const convention = await getConventionByToken(token, 'company');
    if (!convention || convention.status !== 'En attente Entreprise') throw new Error('Lien invalide.');
    
    // Pour cette version, on considère que l'entreprise valide les données. Pas besoin de créer de compte.
    // On pourrait ajouter une création de compte ici comme pour l'étudiant.
    return await conventionRepository.update(convention.id, { status: 'Prête à signer' });
}

async function getConventionsForUser(user) {
  console.log("--- SERVICE: Entrée dans getConventionsForUser avec l'ID utilisateur:", user.id); // <-- LIGNE 3
  if (user.role === 'School') {
    console.log("--- SERVICE: Rôle École détecté. Appel du repository..."); // <-- LIGNE 4
    return await conventionRepository.findAllBySchoolId(user.id);
  }
    if (user.role === 'School') return await conventionRepository.findAllBySchoolId(user.id);
    if (user.role === 'Student') return await conventionRepository.findAllByStudentId(user.id);
    if (user.role === 'Company') return await conventionRepository.findAllByCompanyId(user.id);
    return [];
}

async function signConvention(conventionId, user) {
    const convention = await conventionRepository.findById(conventionId);
    if (!convention || convention.status !== 'Prête à signer') throw new Error('Cette convention ne peut pas être signée actuellement.');

    const isStudent = user.id === convention.studentId;
    const isCompany = user.id === convention.companyId;
    const isSchool = user.id === convention.schoolId;

    if (isStudent && !convention.studentSignature) {
        convention.studentSignature = new Date();
    } else if (isCompany && convention.studentSignature && !convention.companySignature) {
        convention.companySignature = new Date();
    } else if (isSchool && convention.studentSignature && convention.companySignature && !convention.schoolSignature) {
        convention.schoolSignature = new Date();
        convention.status = 'Signée'; // Statut final
    } else {
        throw new Error('Action de signature non autorisée ou non respect de l\'ordre de signature.');
    }
    
    const updatedConvention = await convention.save();

    if (updatedConvention.status === 'Signée') {
        // const pdf = await generateConventionPdf(updatedConvention);
        // await sendFinalConventionEmail(updatedConvention, pdf);
        console.log("CONVENTION FINALISÉE. Envoi d'email désactivé pour le test.");
    }
    return updatedConvention;
}


module.exports = { createConventionBySchool, getConventionByToken, completeByStudent, completeByCompany, getConventionsForUser, signConvention };