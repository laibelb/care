const express = require('express');
const router = express.Router();

// Mock data - in a real app, this would come from a database
const visits = [
  { 
    id: '1', 
    careRecipientId: '1', 
    caregiverId: '11', 
    caregiverName: 'Leoman Gonzales', 
    caregiverPhoto: 'https://randomuser.me/api/portraits/men/12.jpg',
    scheduledStart: '2025-02-27T08:00:00', 
    scheduledEnd: '2025-02-27T16:00:00', 
    duration: 480,
    status: 'scheduled', 
    type: 'Aide Visit',
    location: 'Home',
    color: '#4CAF50',
    recurrence: 'daily',
    notes: 'Regular weekday care. Assist with morning routine and medications. Prepare kosher lunch.',
    tasks: [
      { id: '1', description: 'Morning prayers assistance', completed: false },
      { id: '2', description: 'Administer morning medications', completed: false },
      { id: '3', description: 'Prepare breakfast', completed: false },
      { id: '4', description: 'Personal hygiene assistance', completed: false },
      { id: '5', description: 'Prepare kosher lunch', completed: false },
      { id: '6', description: 'Afternoon medications', completed: false }
    ]
  },
  { 
    id: '2', 
    careRecipientId: '1', 
    caregiverId: '12', 
    caregiverName: 'Dr. Sarah Goldstein', 
    caregiverPhoto: 'https://randomuser.me/api/portraits/women/52.jpg',
    scheduledStart: '2025-02-28T13:30:00', 
    scheduledEnd: '2025-02-28T14:30:00', 
    duration: 60,
    status: 'scheduled', 
    type: 'Doctor Appointment',
    location: 'Mount Sinai Nephrology, Room 305',
    color: '#FF5722',
    notes: 'Monthly nephrology checkup. Review dialysis efficacy and lab results.',
    tasks: [
      { id: '7', description: 'Bring medical history folder', completed: false },
      { id: '8', description: 'Bring list of current medications', completed: false },
      { id: '9', description: 'Bring recent lab results', completed: false },
      { id: '10', description: 'Questions about kidney function', completed: false }
    ]
  },
  { 
    id: '3', 
    careRecipientId: '1', 
    caregiverId: '9', 
    caregiverName: 'Ari Berkowitz', 
    caregiverPhoto: 'https://randomuser.me/api/portraits/men/64.jpg',
    scheduledStart: '2025-02-27T18:00:00', 
    scheduledEnd: '2025-02-27T20:00:00', 
    duration: 120,
    status: 'scheduled', 
    type: 'Family Visit',
    location: 'Home',
    color: '#2196F3',
    notes: 'Evening visit. Bringing dinner from Kosher Kitchen restaurant.',
    tasks: [
      { id: '11', description: 'Pick up dinner', completed: false },
      { id: '12', description: 'Evening medication reminder', completed: false },
      { id: '13', description: 'Help with evening prayers', completed: false }
    ]
  },
  { 
    id: '4', 
    careRecipientId: '1', 
    caregiverId: '11', 
    caregiverName: 'Leoman Gonzales', 
    caregiverPhoto: 'https://randomuser.me/api/portraits/men/12.jpg',
    scheduledStart: '2025-02-26T08:00:00', 
    scheduledEnd: '2025-02-26T09:30:00', 
    duration: 90,
    status: 'completed', 
    type: 'Dialysis Transportation',
    location: 'Mount Sinai Dialysis Center',
    color: '#9C27B0',
    recurrence: 'MWF',
    notes: 'Transportation to dialysis center. Ensure all dialysis supplies are packed.',
    tasks: [
      { id: '14', description: 'Morning medications', completed: true },
      { id: '15', description: 'Pack dialysis bag', completed: true },
      { id: '16', description: 'Transportation to dialysis center', completed: true },
      { id: '17', description: 'Check-in at reception', completed: true }
    ]
  },
  {
    id: '5',
    careRecipientId: '1',
    caregiverId: '3',
    caregiverName: 'Chaya Berkowitz',
    caregiverPhoto: 'https://randomuser.me/api/portraits/women/45.jpg',
    scheduledStart: '2025-02-26T16:00:00',
    scheduledEnd: '2025-02-26T18:00:00',
    duration: 120,
    status: 'completed',
    type: 'Family Visit',
    location: 'Home',
    color: '#2196F3',
    notes: 'Afternoon visit. Bringing special kosher meal and grandchildren.',
    tasks: [
      { id: '18', description: 'Bring kosher dinner', completed: true },
      { id: '19', description: 'Help with medication', completed: true },
      { id: '20', description: 'Read together', completed: true }
    ]
  },
  {
    id: '6',
    careRecipientId: '1',
    caregiverId: '0',
    caregiverName: 'Kosher Meals on Wheels',
    scheduledStart: '2025-02-29T11:00:00',
    scheduledEnd: '2025-02-29T11:15:00',
    duration: 15,
    status: 'scheduled',
    type: 'Meal Delivery',
    location: 'Home',
    color: '#FFC107',
    recurrence: 'weekly',
    notes: 'Friday delivery of Shabbat meals for the weekend.',
    tasks: [
      { id: '21', description: 'Receive delivery', completed: false },
      { id: '22', description: 'Store meals properly', completed: false }
    ]
  },
  {
    id: '7',
    careRecipientId: '1',
    caregiverId: '7',
    caregiverName: 'Rena Berkowitz',
    caregiverPhoto: 'https://randomuser.me/api/portraits/women/26.jpg',
    scheduledStart: '2025-03-01T14:00:00',
    scheduledEnd: '2025-03-01T18:00:00',
    duration: 240,
    status: 'scheduled',
    type: 'Shabbat Visit',
    location: 'Home',
    color: '#673AB7',
    notes: 'Shabbat afternoon visit. Will read and spend time together.',
    tasks: [
      { id: '23', description: 'Help with Shabbat observance', completed: false },
      { id: '24', description: 'Afternoon reading', completed: false }
    ]
  },
  {
    id: '8',
    careRecipientId: '1',
    caregiverId: '13',
    caregiverName: 'Pharmacy Delivery',
    scheduledStart: '2025-03-02T10:00:00',
    scheduledEnd: '2025-03-02T10:15:00',
    duration: 15,
    status: 'scheduled',
    type: 'Medication Delivery',
    location: 'Home',
    color: '#E91E63',
    notes: 'Monthly medication refill delivery from Boro Park Pharmacy.',
    tasks: [
      { id: '25', description: 'Receive delivery', completed: false },
      { id: '26', description: 'Check medications against list', completed: false },
      { id: '27', description: 'Organize in pill organizer', completed: false }
    ]
  }
];

// GET all visits
router.get('/', (req, res) => {
  res.json(visits);
});

// GET visit by ID
router.get('/:id', (req, res) => {
  const visit = visits.find(v => v.id === req.params.id);
  
  if (!visit) {
    return res.status(404).json({ message: 'Visit not found' });
  }
  
  res.json(visit);
});

// GET visits by care recipient ID
router.get('/care-recipient/:careRecipientId', (req, res) => {
  const recipientVisits = visits.filter(v => v.careRecipientId === req.params.careRecipientId);
  
  // Sort by scheduled date, nearest future first
  recipientVisits.sort((a, b) => new Date(a.scheduledStart) - new Date(b.scheduledStart));
  
  res.json(recipientVisits);
});

// GET visits by caregiver ID
router.get('/caregiver/:caregiverId', (req, res) => {
  const caregiverVisits = visits.filter(v => v.caregiverId === req.params.caregiverId);
  
  // Sort by scheduled date, nearest future first
  caregiverVisits.sort((a, b) => new Date(a.scheduledStart) - new Date(b.scheduledStart));
  
  res.json(caregiverVisits);
});

// GET upcoming visits by care recipient ID
router.get('/care-recipient/:careRecipientId/upcoming', (req, res) => {
  const now = new Date();
  const upcomingVisits = visits.filter(v => {
    return v.careRecipientId === req.params.careRecipientId &&
           new Date(v.scheduledStart) > now &&
           v.status === 'scheduled';
  });
  
  // Sort by scheduled date, nearest future first
  upcomingVisits.sort((a, b) => new Date(a.scheduledStart) - new Date(b.scheduledStart));
  
  res.json(upcomingVisits);
});

// POST create new visit
router.post('/', (req, res) => {
  const newVisit = {
    id: Date.now().toString(),
    ...req.body
  };
  
  visits.push(newVisit);
  
  res.status(201).json(newVisit);
});

// PUT update visit
router.put('/:id', (req, res) => {
  const index = visits.findIndex(v => v.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Visit not found' });
  }
  
  const updatedVisit = {
    ...visits[index],
    ...req.body
  };
  
  visits[index] = updatedVisit;
  
  res.json(updatedVisit);
});

// PUT update visit status
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const index = visits.findIndex(v => v.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Visit not found' });
  }
  
  if (!['scheduled', 'completed', 'cancelled'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }
  
  visits[index].status = status;
  
  res.json(visits[index]);
});

// PUT update visit task
router.put('/:id/tasks/:taskId', (req, res) => {
  const { completed } = req.body;
  const visitIndex = visits.findIndex(v => v.id === req.params.id);
  
  if (visitIndex === -1) {
    return res.status(404).json({ message: 'Visit not found' });
  }
  
  const taskIndex = visits[visitIndex].tasks.findIndex(t => t.id === req.params.taskId);
  
  if (taskIndex === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  visits[visitIndex].tasks[taskIndex].completed = completed;
  
  res.json(visits[visitIndex]);
});

// DELETE visit
router.delete('/:id', (req, res) => {
  const index = visits.findIndex(v => v.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Visit not found' });
  }
  
  visits.splice(index, 1);
  
  res.json({ message: 'Visit deleted successfully' });
});

module.exports = router;