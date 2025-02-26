class CareRecipient {
  constructor(id, name, dob, medicalConditions, allergies, notes) {
    this.id = id;
    this.name = name;
    this.dob = dob;
    this.medicalConditions = medicalConditions || [];
    this.allergies = allergies || [];
    this.notes = notes;
  }
}

class Medication {
  constructor(id, name, dosage, frequency, startDate, endDate, notes, prescribedBy) {
    this.id = id;
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

export { CareRecipient, Medication, HealthEvent, Visit };