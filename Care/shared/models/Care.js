class CareRecipient {
  constructor(id, name, dob, medicalConditions, allergies, notes, primaryPhoto, preferredName) {
    this.id = id;
    this.name = name;
    this.preferredName = preferredName || name;
    this.dob = dob;
    this.medicalConditions = medicalConditions || [];
    this.allergies = allergies || [];
    this.notes = notes;
    this.primaryPhoto = primaryPhoto;
  }
}

class CareRecipientProfile {
  constructor(careRecipientId, medicalID, primaryPhysician, address, emergencyContacts, preferredHospital, dialysisSchedule, dialysisCenter, bloodType) {
    this.careRecipientId = careRecipientId;
    this.medicalID = medicalID;
    this.primaryPhysician = primaryPhysician;
    this.address = address;
    this.emergencyContacts = emergencyContacts || [];
    this.preferredHospital = preferredHospital;
    this.dialysisSchedule = dialysisSchedule;
    this.dialysisCenter = dialysisCenter;
    this.bloodType = bloodType;
  }
}

class CareRecipientAccess {
  constructor(id, careRecipientId, userId, accessLevel, relationshipToPatient, dateGranted, status) {
    this.id = id;
    this.careRecipientId = careRecipientId;
    this.userId = userId;
    this.accessLevel = accessLevel; // 'admin', 'caregiver', 'readonly'
    this.relationshipToPatient = relationshipToPatient;
    this.dateGranted = dateGranted || new Date().toISOString();
    this.status = status || 'active'; // 'active', 'pending', 'revoked'
  }
}

class Medication {
  constructor(id, careRecipientId, name, dosage, frequency, startDate, endDate, notes, prescribedBy) {
    this.id = id;
    this.careRecipientId = careRecipientId;
    this.name = name;
    this.dosage = dosage;
    this.frequency = frequency;
    this.startDate = startDate;
    this.endDate = endDate;
    this.notes = notes;
    this.prescribedBy = prescribedBy;
  }
}

class HealthEvent {
  constructor(id, careRecipientId, date, type, notes, vitals, medications, caregivers) {
    this.id = id;
    this.careRecipientId = careRecipientId;
    this.date = date;
    this.type = type; // 'doctor_visit', 'hospital_stay', 'symptom', etc.
    this.notes = notes;
    this.vitals = vitals || {};
    this.medications = medications || [];
    this.caregivers = caregivers || [];
  }
}

class Visit {
  constructor(id, careRecipientId, caregiverId, scheduledStart, scheduledEnd, status, notes, tasks) {
    this.id = id;
    this.careRecipientId = careRecipientId;
    this.caregiverId = caregiverId;
    this.scheduledStart = scheduledStart;
    this.scheduledEnd = scheduledEnd;
    this.status = status; // 'scheduled', 'completed', 'cancelled'
    this.notes = notes;
    this.tasks = tasks || [];
  }
}

export { CareRecipient, CareRecipientProfile, CareRecipientAccess, Medication, HealthEvent, Visit };