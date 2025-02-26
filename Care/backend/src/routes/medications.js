const express = require('express');
const router = express.Router();

// Mock data - in a real app, this would come from a database
const medications = [
  { 
    id: '1', 
    careRecipientId: '1',
    name: 'Epoetin Alfa (Epogen)', 
    dosage: '4,000 units', 
    frequency: 'Three times weekly (on dialysis days)', 
    startDate: '2024-08-15', 
    endDate: '', 
    prescribedBy: 'Dr. Sarah Goldstein',
    category: 'Dialysis Medication',
    purpose: 'Treats anemia in kidney disease',
    pillColor: 'Red',
    pillShape: 'Capsule',
    kosherStatus: 'Kosher',
    refills: 2,
    pharmacy: 'Boro Park Specialty Pharmacy',
    sideEffects: 'Headache, joint pain, nausea',
    notes: 'Administered during dialysis. Monitor blood pressure after administration.'
  },
  { 
    id: '2', 
    careRecipientId: '1',
    name: 'Sevelamer (Renvela)', 
    dosage: '800mg', 
    frequency: 'Three times daily with meals', 
    startDate: '2024-09-01', 
    endDate: '', 
    prescribedBy: 'Dr. Sarah Goldstein',
    category: 'Phosphate Binder',
    purpose: 'Controls phosphorus levels',
    pillColor: 'White',
    pillShape: 'Oval tablet',
    kosherStatus: 'Kosher',
    refills: 3,
    pharmacy: 'Boro Park Specialty Pharmacy',
    sideEffects: 'Nausea, vomiting, constipation',
    notes: 'Take with meals. Do not take at same time as other medications.'
  },
  { 
    id: '3', 
    careRecipientId: '1',
    name: 'Calcitriol', 
    dosage: '0.25mcg', 
    frequency: 'Once daily', 
    startDate: '2024-08-10', 
    endDate: '', 
    prescribedBy: 'Dr. Sarah Goldstein',
    category: 'Vitamin D Analog',
    purpose: 'Manages calcium and phosphorus levels',
    pillColor: 'Yellow',
    pillShape: 'Round tablet',
    kosherStatus: 'Kosher',
    refills: 5,
    pharmacy: 'Boro Park Specialty Pharmacy',
    sideEffects: 'Headache, nausea',
    notes: 'Take in the evening. Monitor calcium levels.'
  },
  { 
    id: '4', 
    careRecipientId: '1',
    name: 'Metoprolol', 
    dosage: '25mg', 
    frequency: 'Twice daily', 
    startDate: '2024-07-15', 
    endDate: '', 
    prescribedBy: 'Dr. David Cohen',
    category: 'Beta-blocker',
    purpose: 'Treats high blood pressure and heart conditions',
    pillColor: 'Blue',
    pillShape: 'Round tablet',
    kosherStatus: 'Kosher',
    refills: 2,
    pharmacy: 'Boro Park Specialty Pharmacy',
    sideEffects: 'Fatigue, dizziness',
    notes: 'Take with food. Do not stop taking suddenly.'
  },
  { 
    id: '5', 
    careRecipientId: '1',
    name: 'Insulin Glargine (Lantus)', 
    dosage: '20 units', 
    frequency: 'Once daily at bedtime', 
    startDate: '2024-08-05', 
    endDate: '', 
    prescribedBy: 'Dr. Rachel Klein',
    category: 'Insulin',
    purpose: 'Controls blood sugar',
    medicationType: 'Injection',
    kosherStatus: 'Kosher',
    refills: 1,
    pharmacy: 'Boro Park Specialty Pharmacy',
    sideEffects: 'Hypoglycemia, injection site reactions',
    notes: 'Administer at same time each evening. Monitor blood sugar levels.'
  },
  { 
    id: '6', 
    careRecipientId: '1',
    name: 'Furosemide (Lasix)', 
    dosage: '40mg', 
    frequency: 'Once daily in morning', 
    startDate: '2024-09-10', 
    endDate: '', 
    prescribedBy: 'Dr. Sarah Goldstein',
    category: 'Diuretic',
    purpose: 'Reduces fluid buildup',
    pillColor: 'White',
    pillShape: 'Round tablet',
    kosherStatus: 'Kosher',
    refills: 3,
    pharmacy: 'Boro Park Specialty Pharmacy',
    sideEffects: 'Frequent urination, dizziness',
    notes: 'Take in morning to avoid nighttime urination. Monitor potassium levels.'
  },
  { 
    id: '7', 
    careRecipientId: '1',
    name: 'Darbepoetin Alfa (Aranesp)', 
    dosage: '60mcg', 
    frequency: 'Once weekly (Fridays)', 
    startDate: '2024-10-01', 
    endDate: '2024-12-01', 
    prescribedBy: 'Dr. Sarah Goldstein',
    category: 'ESA Medication',
    purpose: 'Treats anemia in kidney disease',
    medicationType: 'Injection',
    kosherStatus: 'Kosher',
    refills: 0,
    pharmacy: 'Hospital pharmacy',
    sideEffects: 'Hypertension, injection site pain',
    notes: 'Discontinued and replaced with Epoetin Alfa (more effective for patient).'
  },
  { 
    id: '8', 
    careRecipientId: '1',
    name: 'Folic Acid', 
    dosage: '1mg', 
    frequency: 'Once daily', 
    startDate: '2024-09-15', 
    endDate: '', 
    prescribedBy: 'Dr. Sarah Goldstein',
    category: 'Vitamin Supplement',
    purpose: 'Supports red blood cell production',
    pillColor: 'Green',
    pillShape: 'Round tablet',
    kosherStatus: 'Kosher',
    refills: 5,
    pharmacy: 'Boro Park Specialty Pharmacy',
    sideEffects: 'Generally well-tolerated',
    notes: 'Take with breakfast.'
  }
];

// GET all medications
router.get('/', (req, res) => {
  res.json(medications);
});

// GET medication by ID
router.get('/:id', (req, res) => {
  const medication = medications.find(m => m.id === req.params.id);
  
  if (!medication) {
    return res.status(404).json({ message: 'Medication not found' });
  }
  
  res.json(medication);
});

// GET medications by care recipient ID
router.get('/care-recipient/:careRecipientId', (req, res) => {
  const recipientMedications = medications.filter(m => m.careRecipientId === req.params.careRecipientId);
  
  res.json(recipientMedications);
});

// GET current medications by care recipient ID
router.get('/care-recipient/:careRecipientId/current', (req, res) => {
  const today = new Date().toISOString().split('T')[0];
  const currentMedications = medications.filter(m => {
    return m.careRecipientId === req.params.careRecipientId &&
           (!m.endDate || m.endDate >= today);
  });
  
  res.json(currentMedications);
});

// POST create new medication
router.post('/', (req, res) => {
  const newMedication = {
    id: Date.now().toString(),
    ...req.body
  };
  
  medications.push(newMedication);
  
  res.status(201).json(newMedication);
});

// PUT update medication
router.put('/:id', (req, res) => {
  const index = medications.findIndex(m => m.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Medication not found' });
  }
  
  const updatedMedication = {
    ...medications[index],
    ...req.body
  };
  
  medications[index] = updatedMedication;
  
  res.json(updatedMedication);
});

// DELETE medication
router.delete('/:id', (req, res) => {
  const index = medications.findIndex(m => m.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Medication not found' });
  }
  
  medications.splice(index, 1);
  
  res.json({ message: 'Medication deleted successfully' });
});

module.exports = router;