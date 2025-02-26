const express = require('express');
const router = express.Router();

// Mock data - in a real app, this would come from a database
const careRecipients = [
  { 
    id: '1', 
    name: 'Rabbi Berkowitz', 
    dob: '1948-11-09', 
    medicalConditions: ['Kidney Disease', 'Hypertension', 'Type 2 Diabetes', 'Heart Condition'],
    allergies: ['Penicillin', 'Sulfa Drugs'],
    notes: 'Prefers kosher meals. Enjoys reading religious texts and teaching. Needs assistance with mobility.',
    familyId: '1',
    primaryDoctorName: 'Dr. Sarah Goldstein',
    primaryDoctorPhone: '555-222-3333',
    dialysisSchedule: 'Monday, Wednesday, Friday - 9:00 AM',
    photoUrl: 'https://randomuser.me/api/portraits/men/78.jpg',
    emergencyContacts: [
      { name: 'Leah Berkowitz', relation: 'Wife', phone: '555-111-2222' },
      { name: 'Mayor Berkowitz', relation: 'Son', phone: '555-333-4444' },
      { name: 'Ari Berkowitz', relation: 'Son', phone: '555-555-6666' }
    ]
  }
];

// GET all care recipients
router.get('/', (req, res) => {
  res.json(careRecipients);
});

// GET care recipient by ID
router.get('/:id', (req, res) => {
  const careRecipient = careRecipients.find(cr => cr.id === req.params.id);
  
  if (!careRecipient) {
    return res.status(404).json({ message: 'Care recipient not found' });
  }
  
  res.json(careRecipient);
});

// GET care recipients by familyId
router.get('/family/:familyId', (req, res) => {
  const familyCareRecipients = careRecipients.filter(cr => cr.familyId === req.params.familyId);
  
  res.json(familyCareRecipients);
});

// POST create new care recipient
router.post('/', (req, res) => {
  const newCareRecipient = {
    id: Date.now().toString(),
    ...req.body
  };
  
  careRecipients.push(newCareRecipient);
  
  res.status(201).json(newCareRecipient);
});

// PUT update care recipient
router.put('/:id', (req, res) => {
  const index = careRecipients.findIndex(cr => cr.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Care recipient not found' });
  }
  
  const updatedCareRecipient = {
    ...careRecipients[index],
    ...req.body
  };
  
  careRecipients[index] = updatedCareRecipient;
  
  res.json(updatedCareRecipient);
});

// DELETE care recipient
router.delete('/:id', (req, res) => {
  const index = careRecipients.findIndex(cr => cr.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Care recipient not found' });
  }
  
  careRecipients.splice(index, 1);
  
  res.json({ message: 'Care recipient deleted successfully' });
});

module.exports = router;