class Convention {
  constructor({ id, studentId, schoolId, companyId, content, status, createdAt, updatedAt }) {
    this.id = id;
    this.studentId = studentId;
    this.schoolId = schoolId;
    this.companyId = companyId;
    this.content = content; // texte ou JSON
    this.status = status; // 'En attente', 'Signée', 'Refusée', 'À signer'
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}

module.exports = Convention;
