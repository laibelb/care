const express = require('express');
const router = express.Router();

// Mock data - in a real app, this would come from a database
const healthEvents = [
  { 
    id: '1', 
    careRecipientId: '1',
    date: '2025-02-24T09:30:00', 
    type: 'Vital Signs', 
    notes: 'Pre-dialysis check. Patient reported slight fatigue.',
    vitals: {
      bloodPressure: '142/88',
      heartRate: '76',
      temperature: '98.4',
      bloodSugar: '132',
      weight: '168.5',
      oxygenLevel: '96',
      urineOutput: 'Minimal',
      edema: 'Mild in ankles'
    },
    caregiverId: '11',
    caregiverName: 'Leoman Gonzales',
    location: 'Home',
    followUp: 'Report elevated BP to nephrologist'
  },
  { 
    id: '2', 
    careRecipientId: '1',
    date: '2025-02-20T14:00:00', 
    type: 'Nephrology Appointment', 
    severity: 'Routine',
    notes: 'Monthly nephrology appointment with Dr. Goldstein. Dialysis prescription adjusted. Discussed fluid retention concerns.',
    vitals: {
      bloodPressure: '138/84',
      heartRate: '78',
      temperature: '98.6',
      bloodSugar: '128',
      weight: '167.2',
      oxygenLevel: '97'
    },
    labResults: {
      bun: '62 mg/dL',
      creatinine: '4.8 mg/dL',
      potassium: '4.2 mEq/L',
      calcium: '9.1 mg/dL',
      phosphorus: '5.2 mg/dL'
    },
    caregiverId: '1',
    caregiverName: 'Leah Berkowitz',
    location: 'Mount Sinai Nephrology Clinic',
    followUp: 'Return in 4 weeks, increased fluid restriction to 1L/day',
    documents: ['Lab Results', 'Updated Medication List', 'Dialysis Prescription']
  },
  { 
    id: '3', 
    careRecipientId: '1',
    date: '2025-02-18T10:15:00', 
    type: 'Symptom', 
    severity: 'Mild',
    notes: 'Reported dizziness and slight shortness of breath after morning prayers. Symptoms resolved after rest.',
    vitals: {
      bloodPressure: '146/90',
      heartRate: '88',
      temperature: '',
      bloodSugar: '138',
      weight: '',
      oxygenLevel: '94'
    },
    caregiverId: '11',
    caregiverName: 'Leoman Gonzales',
    location: 'Home',
    followUp: 'Monitor BP more frequently, ensure medications taken with breakfast',
    interventions: ['Administered prescribed medications', 'Encouraged rest', 'Reduced salt intake at lunch']
  },
  { 
    id: '4', 
    careRecipientId: '1',
    date: '2025-02-15T09:00:00', 
    type: 'Vital Signs', 
    notes: 'Post-dialysis check. Patient feeling well.',
    vitals: {
      bloodPressure: '130/78',
      heartRate: '72',
      temperature: '98.6',
      bloodSugar: '118',
      weight: '165.2',
      oxygenLevel: '98',
      urineOutput: 'Minimal',
      edema: 'None'
    },
    caregiverId: '11',
    caregiverName: 'Leoman Gonzales',
    location: 'Home',
    followUp: 'Continue current medication regimen'
  },
  {
    id: '5',
    careRecipientId: '1',
    date: '2025-02-13T11:00:00',
    type: 'Dialysis Session',
    notes: 'Routine dialysis session. Four hour treatment completed with no complications.',
    vitals: {
      pre: {
        bloodPressure: '144/86',
        heartRate: '78',
        weight: '169.4',
        oxygenLevel: '96'
      },
      post: {
        bloodPressure: '132/80',
        heartRate: '74',
        weight: '165.8',
        oxygenLevel: '98'
      }
    },
    dialysisDetails: {
      duration: '4 hours',
      fluidRemoved: '3.6 L',
      accessSite: 'AV Fistula (left arm)',
      accessCondition: 'Good',
      complications: 'None'
    },
    caregiverId: '1',
    caregiverName: 'Leah Berkowitz',
    location: 'Mount Sinai Dialysis Center',
    followUp: 'Next dialysis session scheduled for Feb 15'
  },
  {
    id: '6',
    careRecipientId: '1',
    date: '2025-02-10T15:30:00',
    type: 'Cardiology Appointment',
    severity: 'Routine',
    notes: 'Quarterly cardiology check-up with Dr. Cohen. Heart function stable. ECG shows normal sinus rhythm.',
    vitals: {
      bloodPressure: '140/82',
      heartRate: '74',
      temperature: '98.4',
      oxygenLevel: '97'
    },
    testResults: {
      ecg: 'Normal sinus rhythm, no ST changes',
      echo: 'EF 50%, mild LVH, no significant changes from previous'
    },
    caregiverId: '9',
    caregiverName: 'Ari Berkowitz',
    location: 'Dr. Cohen\'s Cardiology Office',
    followUp: 'Continue current heart medications, return in 3 months',
    documents: ['ECG Report', 'Updated Cardiac Assessment']
  },
  {
    id: '7',
    careRecipientId: '1',
    date: '2025-02-05T08:30:00',
    type: 'Fall',
    severity: 'Moderate',
    notes: 'Patient slipped in bathroom while getting ready for morning prayers. No loss of consciousness. Small bruise on right hip.',
    vitals: {
      bloodPressure: '148/88',
      heartRate: '92',
      temperature: '98.6',
      oxygenLevel: '97'
    },
    caregiverId: '11',
    caregiverName: 'Leoman Gonzales',
    location: 'Home',
    followUp: 'Applied cold compress, monitored for 24 hours, installed additional bathroom grab bars',
    interventions: ['Pain assessed - rated 2/10', 'ROM assessment - full mobility preserved', 'Fall risk assessment completed']
  },
  {
    id: '8',
    careRecipientId: '1',
    date: '2025-01-28T09:00:00',
    type: 'Medication Adjustment',
    notes: 'Furosemide dosage increased from 20mg to 40mg daily due to increased fluid retention.',
    vitals: {
      bloodPressure: '146/88',
      heartRate: '76',
      weight: '170.2',
      edema: 'Moderate in ankles and feet'
    },
    caregiverId: '12',
    caregiverName: 'Dr. Sarah Goldstein',
    location: 'Phone Consultation',
    followUp: 'Monitor weight daily, report if edema worsens'
  }
];

// GET all health events
router.get('/', (req, res) => {
  res.json(healthEvents);
});

// GET health event by ID
router.get('/:id', (req, res) => {
  const healthEvent = healthEvents.find(he => he.id === req.params.id);
  
  if (!healthEvent) {
    return res.status(404).json({ message: 'Health event not found' });
  }
  
  res.json(healthEvent);
});

// GET health events by care recipient ID
router.get('/care-recipient/:careRecipientId', (req, res) => {
  const recipientEvents = healthEvents.filter(he => he.careRecipientId === req.params.careRecipientId);
  
  // Sort by date, newest first
  recipientEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  res.json(recipientEvents);
});

// GET health events by care recipient ID and type
router.get('/care-recipient/:careRecipientId/type/:type', (req, res) => {
  const recipientTypeEvents = healthEvents.filter(he => 
    he.careRecipientId === req.params.careRecipientId && 
    he.type === req.params.type
  );
  
  // Sort by date, newest first
  recipientTypeEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  res.json(recipientTypeEvents);
});

// POST create new health event
router.post('/', (req, res) => {
  const newHealthEvent = {
    id: Date.now().toString(),
    ...req.body
  };
  
  healthEvents.push(newHealthEvent);
  
  res.status(201).json(newHealthEvent);
});

// PUT update health event
router.put('/:id', (req, res) => {
  const index = healthEvents.findIndex(he => he.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Health event not found' });
  }
  
  const updatedHealthEvent = {
    ...healthEvents[index],
    ...req.body
  };
  
  healthEvents[index] = updatedHealthEvent;
  
  res.json(updatedHealthEvent);
});

// DELETE health event
router.delete('/:id', (req, res) => {
  const index = healthEvents.findIndex(he => he.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Health event not found' });
  }
  
  healthEvents.splice(index, 1);
  
  res.json({ message: 'Health event deleted successfully' });
});

module.exports = router;