const { v4: uuidv4 } = require('uuid');
const conventionRepository = require('../repositories/conventionRepository');
const userRepository = require('../repositories/UserRepository');
const { generateConventionPdf } = require('./pdfService');
const { sendConventionSignedEmail } = require('./emailService');

const validStatuses = ["En attente", "À signer", "Signée", "Refusée"];

async function createConvention(data) {
  const { studentId, schoolId, companyId } = data;
  if (!studentId || !schoolId || !companyId) {
    throw new Error('IDs pour étudiant, école et entreprise sont requis');
  }
  const student = await userRepository.findById(studentId);
  const school = await userRepository.findById(schoolId);
  const company = await userRepository.findById(companyId);
  if (!student || !school || !company) {
    throw new Error('Un des utilisateurs spécifiés (étudiant, école, ou entreprise) n\'existe pas.');
  }
  return await conventionRepository.create(data);
}

async function getConventionById(id) {
  const convention = await conventionRepository.findById(id);
  if (!convention) {
    throw new Error('Convention non trouvée');
  }
  return convention;
}

async function getAllConventions() {
  return await conventionRepository.findAll();
}

async function getConventionsForSchool(schoolId) {
  if (!schoolId) {
    throw new Error('Un ID d\'école est requis.');
  }
  return await conventionRepository.findAllBySchoolId(schoolId);
}

async function getConventionsForStudent(studentId) {
  if (!studentId) {
    throw new Error('Un ID d\'étudiant est requis.');
  }
  return await conventionRepository.findAllByStudentId(studentId);
}

async function updateConventionStatus(id, newStatus) {
  if (!validStatuses.includes(newStatus)) {
    throw new Error('Statut invalide');
  }
  const updatedConvention = await conventionRepository.update(id, { status: newStatus });
  if (!updatedConvention) {
    throw new Error('Convention non trouvée lors de la mise à jour');
  }
  return updatedConvention;
}

async function signConvention(conventionId, user) {
  const convention = await conventionRepository.findById(conventionId);
  if (!convention) {
    throw new Error('Convention non trouvée');
  }

  // On note si la convention était déjà totalement signée avant cette action
  const wasAlreadyFullySigned = !!(convention.studentSignature && convention.schoolSignature && convention.companySignature);

  const isStudent = convention.studentId === user.id;
  const isSchool = convention.schoolId === user.id;
  const isCompany = convention.companyId === user.id;
  if (!isStudent && !isSchool && !isCompany) {
    throw new Error('Action non autorisée. Vous ne faites pas partie de cette convention.');
  }

  if (isStudent) {
    if (convention.studentSignature) throw new Error('Vous avez déjà signé cette convention.');
    convention.studentSignature = new Date();
  } else if (isSchool) {
    if (convention.schoolSignature) throw new Error('Vous avez déjà signé cette convention.');
    convention.schoolSignature = new Date();
  } else if (isCompany) {
    if (convention.companySignature) throw new Error('Vous avez déjà signé cette convention.');
    convention.companySignature = new Date();
  }

  const isNowFullySigned = !!(convention.studentSignature && convention.schoolSignature && convention.companySignature);

  if (isNowFullySigned) {
    convention.status = 'Signée';
  } else {
    convention.status = 'À signer';
  }

  const updatedConvention = await conventionRepository.update(convention.id, convention.dataValues);

  // Si la convention vient juste de passer au statut "complètement signée"...
  if (isNowFullySigned && !wasAlreadyFullySigned) {
    console.log(`Déclenchement de la finalisation pour la convention ${convention.id}...`);
    try {
      // 1. Générer le PDF
      const pdfBuffer = await generateConventionPdf(updatedConvention);
      // 2. Envoyer l'email avec le PDF en pièce jointe
      await sendConventionSignedEmail(updatedConvention, pdfBuffer);
    } catch (error) {
      // On log l'erreur mais on ne bloque pas la réponse à l'utilisateur
      console.error(`Erreur lors de la finalisation (PDF/Email) de la convention ${convention.id}:`, error);
    }
  }

  return updatedConvention;
}

async function initiateConvention(conventionId, user) {
  const convention = await conventionRepository.findById(conventionId);
  if (!convention) throw new Error('Convention non trouvée');
  if (convention.studentId !== user.id) {
    throw new Error('Action non autorisée.');
  }
  const token = uuidv4();
  return await conventionRepository.update(convention.id, { completionToken: token });
}

async function getConventionByToken(token) {
  const convention = await conventionRepository.findByCompletionToken(token);
  if (!convention) {
    throw new Error('Lien invalide ou expiré.');
  }
  return convention;
}

async function completeConventionByToken(token, companyData) {
  const convention = await getConventionByToken(token);
  const dataToUpdate = {
    companyTutorName: companyData.companyTutorName,
    companyAddress: companyData.companyAddress,
    status: 'À signer'
  };
  return await conventionRepository.update(convention.id, dataToUpdate);
}

module.exports = {
  createConvention,
  getConventionById,
  getAllConventions,
  getConventionsForSchool,
  getConventionsForStudent,
  updateConventionStatus,
  signConvention,
  initiateConvention,
  getConventionByToken,
  completeConventionByToken,
};