const express = require('express');
const router = express.Router();

// Mock data - in a real app, this would come from a database
const careRecipients = [
  { 
    id: '1', 
    name: 'Rabbi Berkowitz',
    preferredName: 'Rabbi B', 
    dob: '1948-11-09', 
    medicalConditions: ['Kidney Disease', 'Hypertension', 'Type 2 Diabetes', 'Heart Condition'],
    allergies: ['Penicillin', 'Sulfa Drugs'],
    notes: 'Prefers kosher meals. Enjoys reading religious texts and teaching. Needs assistance with mobility.',
    primaryPhoto: '/images/rabbiB.png',
  },
  { 
    id: '2', 
    name: 'Leah Berkowitz',
    preferredName: 'Leah', 
    dob: '1952-03-15', 
    medicalConditions: ['Arthritis', 'High Cholesterol'],
    allergies: ['Shellfish', 'Ibuprofen'],
    notes: 'Loves knitting and cooking. Prefers phone calls over text messages.',
    primaryPhoto: 'https://randomuser.me/api/portraits/women/68.jpg',
  },
  { 
    id: '3', 
    name: 'Samuel Goldman',
    preferredName: 'Sam', 
    dob: '1945-06-22', 
    medicalConditions: ['Parkinson\'s Disease', 'Glaucoma'],
    allergies: ['Peanuts', 'Latex'],
    notes: 'Former accountant. Enjoys chess and classical music. Needs assistance with fine motor skills.',
    primaryPhoto: 'https://randomuser.me/api/portraits/men/79.jpg',
  }
];

// Profiles for each care recipient
const careRecipientProfiles = [
  {
    careRecipientId: '1',
    medicalID: 'P-2023-1121',
    primaryPhysician: 'Dr. Sarah Goldstein (Nephrologist)',
    address: '123 Main St, New York, NY 10001',
    emergencyContacts: [
      { name: 'Leah Berkowitz', relation: 'Wife', phone: '555-111-2222' },
      { name: 'Mayor Berkowitz', relation: 'Son', phone: '555-333-4444' },
      { name: 'Ari Berkowitz', relation: 'Son', phone: '555-555-6666' }
    ],
    preferredHospital: 'Mount Sinai Medical Center',
    dialysisSchedule: 'Monday, Wednesday, Friday - 9:00 AM',
    dialysisCenter: 'Midtown Dialysis Center • 555-888-9999',
    bloodType: 'A+'
  },
  {
    careRecipientId: '2',
    medicalID: 'P-2023-1122',
    primaryPhysician: 'Dr. Michael Chen (Internal Medicine)',
    address: '123 Main St, New York, NY 10001',
    emergencyContacts: [
      { name: 'Rabbi Berkowitz', relation: 'Husband', phone: '555-222-3333' },
      { name: 'Sarah Berkowitz', relation: 'Daughter', phone: '555-444-5555' }
    ],
    preferredHospital: 'Mount Sinai Medical Center',
    bloodType: 'B-'
  },
  {
    careRecipientId: '3',
    medicalID: 'P-2023-1123',
    primaryPhysician: 'Dr. James Wilson (Neurologist)',
    address: '456 Oak Ave, New York, NY 10002',
    emergencyContacts: [
      { name: 'Rebecca Goldman', relation: 'Daughter', phone: '555-666-7777' },
      { name: 'David Goldman', relation: 'Son', phone: '555-777-8888' }
    ],
    preferredHospital: 'NYU Langone Medical Center',
    bloodType: 'O+'
  }
];

// User access to care recipients
const careRecipientAccess = [
  {
    id: '1',
    careRecipientId: '1',
    userId: '1', // Ari Berkowitz (main user)
    accessLevel: 'admin',
    relationshipToPatient: 'Son',
    dateGranted: '2023-01-15T00:00:00Z',
    status: 'active'
  },
  {
    id: '2',
    careRecipientId: '2', // Leah Berkowitz
    userId: '1', // Ari Berkowitz (main user)
    accessLevel: 'admin',
    relationshipToPatient: 'Son',
    dateGranted: '2023-01-15T00:00:00Z',
    status: 'active'
  },
  {
    id: '3',
    careRecipientId: '3', // Samuel Goldman
    userId: '1', // Ari Berkowitz (main user)
    accessLevel: 'caregiver',
    relationshipToPatient: 'Nephew',
    dateGranted: '2023-05-20T00:00:00Z',
    status: 'active'
  }
];

// GET all care recipients
router.get('/', (req, res) => {
  const userId = req.query.userId;
  
  if (userId) {
    // Filter care recipients that the user has access to
    const accessRecords = careRecipientAccess.filter(access => 
      access.userId === userId && access.status === 'active'
    );
    
    const accessibleIds = accessRecords.map(record => record.careRecipientId);
    const accessibleRecipients = careRecipients.filter(cr => accessibleIds.includes(cr.id));
    
    return res.json(accessibleRecipients);
  }
  
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

// GET care recipient profile by ID
router.get('/:id/profile', (req, res) => {
  const profile = careRecipientProfiles.find(profile => profile.careRecipientId === req.params.id);
  
  if (!profile) {
    return res.status(404).json({ message: 'Care recipient profile not found' });
  }
  
  res.json(profile);
});

// GET full care recipient details by ID (combines basic info and profile)
router.get('/:id/full', (req, res) => {
  const careRecipient = careRecipients.find(cr => cr.id === req.params.id);
  
  if (!careRecipient) {
    return res.status(404).json({ message: 'Care recipient not found' });
  }
  
  const profile = careRecipientProfiles.find(profile => profile.careRecipientId === req.params.id);
  
  const fullDetails = {
    ...careRecipient,
    profile: profile || {}
  };
  
  res.json(fullDetails);
});

// GET user's access to a care recipient
router.get('/:id/access/:userId', (req, res) => {
  const access = careRecipientAccess.find(
    a => a.careRecipientId === req.params.id && a.userId === req.params.userId
  );
  
  if (!access) {
    return res.status(404).json({ message: 'Access record not found' });
  }
  
  res.json(access);
});

// POST create new care recipient
router.post('/', (req, res) => {
  const newCareRecipient = {
    id: Date.now().toString(),
    ...req.body
  };
  
  careRecipients.push(newCareRecipient);
  
  // Create an associated profile if provided
  if (req.body.profile) {
    const newProfile = {
      careRecipientId: newCareRecipient.id,
      ...req.body.profile
    };
    
    careRecipientProfiles.push(newProfile);
  }
  
  // Create default access for the creator
  if (req.body.creatorUserId) {
    const newAccess = {
      id: Date.now().toString() + '-access',
      careRecipientId: newCareRecipient.id,
      userId: req.body.creatorUserId,
      accessLevel: 'admin',
      relationshipToPatient: req.body.creatorRelationship || 'Caregiver',
      dateGranted: new Date().toISOString(),
      status: 'active'
    };
    
    careRecipientAccess.push(newAccess);
  }
  
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

// PUT update care recipient profile
router.put('/:id/profile', (req, res) => {
  const index = careRecipientProfiles.findIndex(
    profile => profile.careRecipientId === req.params.id
  );
  
  if (index === -1) {
    // If profile doesn't exist, create a new one
    const newProfile = {
      careRecipientId: req.params.id,
      ...req.body
    };
    
    careRecipientProfiles.push(newProfile);
    return res.json(newProfile);
  }
  
  const updatedProfile = {
    ...careRecipientProfiles[index],
    ...req.body
  };
  
  careRecipientProfiles[index] = updatedProfile;
  
  res.json(updatedProfile);
});

// POST grant access to a care recipient
router.post('/:id/access', (req, res) => {
  const { userId, accessLevel, relationshipToPatient } = req.body;
  
  // Check if access already exists
  const existingAccess = careRecipientAccess.find(
    access => access.careRecipientId === req.params.id && access.userId === userId
  );
  
  if (existingAccess) {
    // Update existing access
    existingAccess.accessLevel = accessLevel;
    existingAccess.relationshipToPatient = relationshipToPatient;
    existingAccess.status = 'active';
    
    return res.json(existingAccess);
  }
  
  // Create new access
  const newAccess = {
    id: Date.now().toString(),
    careRecipientId: req.params.id,
    userId,
    accessLevel,
    relationshipToPatient,
    dateGranted: new Date().toISOString(),
    status: 'active'
  };
  
  careRecipientAccess.push(newAccess);
  
  res.status(201).json(newAccess);
});

// PUT update access to a care recipient
router.put('/:id/access/:accessId', (req, res) => {
  const index = careRecipientAccess.findIndex(
    access => access.id === req.params.accessId && access.careRecipientId === req.params.id
  );
  
  if (index === -1) {
    return res.status(404).json({ message: 'Access record not found' });
  }
  
  const updatedAccess = {
    ...careRecipientAccess[index],
    ...req.body
  };
  
  careRecipientAccess[index] = updatedAccess;
  
  res.json(updatedAccess);
});

// DELETE care recipient
router.delete('/:id', (req, res) => {
  const index = careRecipients.findIndex(cr => cr.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'Care recipient not found' });
  }
  
  // Remove the care recipient
  careRecipients.splice(index, 1);
  
  // Remove associated profile
  const profileIndex = careRecipientProfiles.findIndex(
    profile => profile.careRecipientId === req.params.id
  );
  
  if (profileIndex !== -1) {
    careRecipientProfiles.splice(profileIndex, 1);
  }
  
  // Remove all access records
  const accessIndices = careRecipientAccess
    .map((access, i) => access.careRecipientId === req.params.id ? i : -1)
    .filter(i => i !== -1)
    .sort((a, b) => b - a); // Sort in descending order to remove from end first
  
  accessIndices.forEach(i => careRecipientAccess.splice(i, 1));
  
  res.json({ message: 'Care recipient deleted successfully' });
});

module.exports = router;