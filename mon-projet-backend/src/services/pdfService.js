const PDFDocument = require('pdfkit');

/**
 * Génère un PDF simple pour une convention.
 * Pour un MVP, le design est basique. Il pourra être amélioré plus tard.
 * @param {object} convention - L'objet convention complet.
 * @returns {Promise<Buffer>} -
 */
function generateConventionPdf(convention) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];
      
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Contenu du PDF
      doc.fontSize(20).text('Convention de Stage', { align: 'center' });
      doc.moveDown(2);

      doc.fontSize(12).text(`Statut: ${convention.status}`);
      doc.text(`ID: ${convention.id}`);
      doc.moveDown();

      doc.fontSize(14).text('Parties concernées :', { underline: true });
      doc.moveDown();
      doc.text(`- Étudiant (ID): ${convention.studentId}`);
      doc.text(`- École (ID): ${convention.schoolId}`);
      doc.text(`- Entreprise (ID): ${convention.companyId}`);
      doc.moveDown();

      doc.fontSize(14).text('Informations Entreprise :', { underline: true });
      doc.moveDown();
      doc.text(`Tuteur: ${convention.companyTutorName || 'Non renseigné'}`);
      doc.text(`Adresse: ${convention.companyAddress || 'Non renseignée'}`);
      doc.moveDown(2);

      doc.fontSize(14).text('Signatures :', { underline: true });
      doc.moveDown();
      doc.text(`Signé par l'étudiant le: ${convention.studentSignature ? new Date(convention.studentSignature).toLocaleDateString('fr-FR') : 'En attente'}`);
      doc.text(`Signé par l'école le: ${convention.schoolSignature ? new Date(convention.schoolSignature).toLocaleDateString('fr-FR') : 'En attente'}`);
      doc.text(`Signé par l'entreprise le: ${convention.companySignature ? new Date(convention.companySignature).toLocaleDateString('fr-FR') : 'En attente'}`);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = { generateConventionPdf };