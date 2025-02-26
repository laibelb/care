const express = require('express');
const router = express.Router();

// Mock data - in a real app, this would come from a database
const users = [
  { 
    id: '1', 
    name: 'Leah Berkowitz', 
    email: 'leah@example.com', 
    phone: '555-111-2222', 
    role: 'primary_caregiver', 
    relation: 'Wife',
    familyId: '1',
    photoUrl: 'https://randomuser.me/api/portraits/women/67.jpg'
  },
  { 
    id: '2', 
    name: 'Mayor Berkowitz', 
    email: 'mayor@example.com', 
    phone: '555-333-4444', 
    role: 'family_member', 
    relation: 'Son',
    familyId: '1',
    photoUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
  },
  { 
    id: '3', 
    name: 'Chaya Berkowitz', 
    email: 'chaya@example.com', 
    phone: '555-444-5555', 
    role: 'family_member', 
    relation: 'Daughter',
    familyId: '1',
    photoUrl: 'https://randomuser.me/api/portraits/women/45.jpg'
  },
  { 
    id: '4', 
    name: 'Yankel Berkowitz', 
    email: 'yankel@example.com', 
    phone: '555-666-7777', 
    role: 'family_member', 
    relation: 'Son',
    familyId: '1',
    photoUrl: 'https://randomuser.me/api/portraits/men/41.jpg'
  },
  { 
    id: '5', 
    name: 'Avrumi Berkowitz', 
    email: 'avrumi@example.com', 
    phone: '555-777-8888', 
    role: 'family_member', 
    relation: 'Son',
    familyId: '1',
    photoUrl: 'https://randomuser.me/api/portraits/men/22.jpg'
  },
  { 
    id: '6', 
    name: 'Yirmiya Berkowitz', 
    email: 'yirmiya@example.com', 
    phone: '555-888-9999', 
    role: 'family_member', 
    relation: 'Son',
    familyId: '1',
    photoUrl: 'https://randomuser.me/api/portraits/men/36.jpg'
  },
  { 
    id: '7', 
    name: 'Rena Berkowitz', 
    email: 'rena@example.com', 
    phone: '555-123-1234', 
    role: 'family_member', 
    relation: 'Daughter',
    familyId: '1',
    photoUrl: 'https://randomuser.me/api/portraits/women/26.jpg'
  },
  { 
    id: '8', 
    name: 'Yossi Berkowitz', 
    email: 'yossi@example.com', 
    phone: '555-234-2345', 
    role: 'family_member', 
    relation: 'Son',
    familyId: '1',
    photoUrl: 'https://randomuser.me/api/portraits/men/58.jpg'
  },
  { 
    id: '9', 
    name: 'Ari Berkowitz', 
    email: 'ari@example.com', 
    phone: '555-555-6666', 
    role: 'admin', 
    relation: 'Son',
    familyId: '1',
    photoUrl: 'https://randomuser.me/api/portraits/men/64.jpg'
  },
  { 
    id: '10', 
    name: 'Rivky Berkowitz', 
    email: 'rivky@example.com', 
    phone: '555-345-3456', 
    role: 'family_member', 
    relation: 'Daughter',
    familyId: '1',
    photoUrl: 'https://randomuser.me/api/portraits/women/38.jpg'
  },
  { 
    id: '11', 
    name: 'Leoman Gonzales', 
    email: 'leoman@example.com', 
    phone: '555-987-9876', 
    role: 'aide', 
    relation: 'Professional Aide',
    familyId: '1',
    schedule: 'Monday-Friday, 8:00 AM - 4:00 PM',
    photoUrl: 'https://randomuser.me/api/portraits/men/12.jpg'
  },
  { 
    id: '12', 
    name: 'Dr. Sarah Goldstein', 
    email: 'dr.goldstein@example.com', 
    phone: '555-222-3333', 
    role: 'medical_professional', 
    relation: 'Primary Physician',
    familyId: '1',
    specialty: 'Nephrology',
    photoUrl: 'https://randomuser.me/api/portraits/women/52.jpg'
  }
];

// GET all users
router.get('/', (req, res) => {
  res.json(users);
});

// GET user by ID
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json(user);
});

// GET users by familyId
router.get('/family/:familyId', (req, res) => {
  const familyUsers = users.filter(u => u.familyId === req.params.familyId);
  
  res.json(familyUsers);
});

// POST create new user
router.post('/', (req, res) => {
  const newUser = {
    id: Date.now().toString(),
    ...req.body
  };
  
  users.push(newUser);
  
  res.status(201).json(newUser);
});

// PUT update user
router.put('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  const updatedUser = {
    ...users[index],
    ...req.body
  };
  
  users[index] = updatedUser;
  
  res.json(updatedUser);
});

// DELETE user
router.delete('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  users.splice(index, 1);
  
  res.json({ message: 'User deleted successfully' });
});

module.exports = router;