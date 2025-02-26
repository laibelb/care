import axios from 'axios';

// For prototype, use localStorage as our "backend"
const localStorageAPI = {
  getItem(key, defaultValue = []) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  },
  setItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    return value;
  }
};

// Mock initial data setup if not present
const setupInitialData = () => {
  // Create initial family members if not exist
  if (!localStorage.getItem('familyMembers')) {
    const initialFamilyMembers = [
      {
        id: '1',
        name: 'Ari Berkowitz',
        email: 'ari@example.com',
        phone: '(123) 456-7890',
        relation: 'Self',
        role: 'primary_caregiver',
        address: '123 Main St, New York, NY',
        photoUrl: '/images/ariB.png',
        lastActive: '2 hours ago',
        isCurrentUser: true
      },
      {
        id: '2',
        name: 'Sarah Berkowitz',
        email: 'sarah@example.com',
        phone: '(123) 456-7891',
        relation: 'Spouse',
        role: 'family_member',
        photoUrl: '/images/sarahB.png',
        lastActive: '5 hours ago'
      },
      {
        id: '3',
        name: 'Leah Berkowitz',
        email: 'leah@example.com',
        phone: '(123) 456-7892',
        relation: 'Mother',
        role: 'family_member',
        photoUrl: '/images/leahB.png',
        lastActive: '2 days ago'
      },
      {
        id: '4',
        name: 'Rabbi Berkowitz',
        email: 'rabbi@example.com',
        phone: '(123) 456-7893',
        relation: 'Father',
        role: 'family_member',
        address: '456 Oak Lane, New York, NY',
        photoUrl: '/images/rabbiB.png',
        lastActive: '1 day ago',
        isPatient: true,
        patientId: '1',
        medicalConditions: ['Type 2 Diabetes', 'Hypertension', 'Arthritis']
      },
      {
        id: '5',
        name: 'Moshe Berkowitz',
        email: 'moshe@example.com',
        phone: '(123) 456-7894',
        relation: 'Brother',
        role: 'family_member',
        photoUrl: '/images/mosheB.png',
        lastActive: '3 days ago'
      },
      {
        id: '6',
        name: 'Rachel Berkowitz',
        email: 'rachel@example.com',
        phone: '(123) 456-7895',
        relation: 'Sister-in-law',
        role: 'family_member',
        photoUrl: '/images/rachelB.png',
        lastActive: '1 week ago'
      },
      {
        id: '7',
        name: 'David Berkowitz',
        email: 'david@example.com',
        phone: '(123) 456-7896',
        relation: 'Cousin',
        role: 'family_member',
        photoUrl: '/images/davidB.png',
        lastActive: '2 weeks ago'
      }
    ];
    localStorageAPI.setItem('familyMembers', initialFamilyMembers);
  }

  // Create initial patients if not exist
  if (!localStorage.getItem('patients')) {
    const initialPatients = [
      {
        id: '1',
        name: 'Rabbi Berkowitz',
        preferredName: 'Dad',
        dob: '1950-04-15',
        age: 73,
        medicalID: 'MID-12345',
        primaryPhysician: {
          name: 'Dr. Susan Chen',
          phone: '(555) 123-4567',
          email: 'schen@medclinic.com'
        },
        address: '456 Oak Lane, New York, NY',
        emergencyContact: {
          name: 'Ari Berkowitz',
          phone: '(123) 456-7890',
          relationship: 'Son'
        },
        preferredHospital: 'Mount Sinai Hospital',
        medicalConditions: ['Type 2 Diabetes', 'Hypertension', 'Arthritis'],
        allergies: ['Penicillin', 'Shellfish'],
        bloodType: 'O+',
        dialysisSchedule: 'MWF 10am-1pm',
        dialysisCenter: 'DaVita Kidney Care',
        nextAppointment: '2023-05-15T13:00:00',
        photoUrl: '/images/rabbiB.png',
        patientId: 'PT-12345',
        caregivers: ['1', '2'] // Family member IDs who are caregivers
      }
    ];
    localStorageAPI.setItem('patients', initialPatients);
  }

  // Create connection between patients and family members
  if (!localStorage.getItem('patientFamilyConnections')) {
    const initialConnections = [
      {
        patientId: '1',
        familyMemberId: '1',
        relationship: 'Son',
        accessLevel: 'full',
        isPrimaryCareGiver: true
      },
      {
        patientId: '1',
        familyMemberId: '2',
        relationship: 'Daughter-in-law',
        accessLevel: 'full',
        isPrimaryCareGiver: false
      }
    ];
    localStorageAPI.setItem('patientFamilyConnections', initialConnections);
  }
};

// Run this once when the app loads
setupInitialData();

// User/Family Member Service
export const userService = {
  getAll: () => {
    return Promise.resolve({ data: localStorageAPI.getItem('familyMembers') });
  },
  getById: (id) => {
    const members = localStorageAPI.getItem('familyMembers');
    const member = members.find(m => m.id === id);
    return Promise.resolve({ data: member });
  },
  getByFamily: () => {
    return Promise.resolve({ data: localStorageAPI.getItem('familyMembers') });
  },
  create: (userData) => {
    const members = localStorageAPI.getItem('familyMembers');
    const newMember = {
      ...userData,
      id: Date.now().toString(), // Generate unique id
      lastActive: 'Just now'
    };
    const updatedMembers = [...members, newMember];
    localStorageAPI.setItem('familyMembers', updatedMembers);
    return Promise.resolve({ data: newMember });
  },
  update: (id, userData) => {
    const members = localStorageAPI.getItem('familyMembers');
    const updatedMembers = members.map(member => 
      member.id === id ? { ...member, ...userData } : member
    );
    localStorageAPI.setItem('familyMembers', updatedMembers);
    const updatedMember = updatedMembers.find(m => m.id === id);
    return Promise.resolve({ data: updatedMember });
  },
  delete: (id) => {
    const members = localStorageAPI.getItem('familyMembers');
    const filteredMembers = members.filter(member => member.id !== id);
    localStorageAPI.setItem('familyMembers', filteredMembers);
    return Promise.resolve({ data: { success: true } });
  }
};

// Care Recipient/Patient Service
export const patientService = {
  getAll: () => {
    return Promise.resolve({ data: localStorageAPI.getItem('patients') });
  },
  getById: (id) => {
    const patients = localStorageAPI.getItem('patients');
    const patient = patients.find(p => p.id === id);
    return Promise.resolve({ data: patient });
  },
  create: (data) => {
    const patients = localStorageAPI.getItem('patients');
    const newPatient = {
      ...data,
      id: Date.now().toString() // Generate unique id
    };
    const updatedPatients = [...patients, newPatient];
    localStorageAPI.setItem('patients', updatedPatients);
    return Promise.resolve({ data: newPatient });
  },
  update: (id, data) => {
    const patients = localStorageAPI.getItem('patients');
    const updatedPatients = patients.map(patient => 
      patient.id === id ? { ...patient, ...data } : patient
    );
    localStorageAPI.setItem('patients', updatedPatients);
    const updatedPatient = updatedPatients.find(p => p.id === id);
    return Promise.resolve({ data: updatedPatient });
  },
  delete: (id) => {
    const patients = localStorageAPI.getItem('patients');
    const filteredPatients = patients.filter(patient => patient.id !== id);
    localStorageAPI.setItem('patients', filteredPatients);
    return Promise.resolve({ data: { success: true } });
  },
  
  // Patient Family Connections
  getPatientFamilyConnections: (patientId) => {
    const connections = localStorageAPI.getItem('patientFamilyConnections');
    const patientConnections = connections.filter(c => c.patientId === patientId);
    return Promise.resolve({ data: patientConnections });
  },
  addFamilyConnection: (patientId, familyMemberId, relationshipData) => {
    const connections = localStorageAPI.getItem('patientFamilyConnections');
    const newConnection = {
      patientId,
      familyMemberId,
      ...relationshipData
    };
    const updatedConnections = [...connections, newConnection];
    localStorageAPI.setItem('patientFamilyConnections', updatedConnections);
    return Promise.resolve({ data: newConnection });
  },
  
  // Convert family member to patient
  convertFamilyMemberToPatient: (familyMemberId, patientData) => {
    // Get the family member details
    const members = localStorageAPI.getItem('familyMembers');
    const member = members.find(m => m.id === familyMemberId);
    
    if (!member) {
      return Promise.reject(new Error('Family member not found'));
    }
    
    // Create new patient from family member
    const patients = localStorageAPI.getItem('patients');
    const newPatient = {
      id: `p-${Date.now()}`, // Generate unique ID
      name: member.name,
      preferredName: patientData.preferredName || member.name.split(' ')[0],
      dob: patientData.dob || '',
      age: patientData.age || 65,
      medicalID: `MID-${Date.now().toString().substring(7)}`,
      primaryPhysician: patientData.primaryPhysician || {
        name: 'Dr. Smith',
        phone: '(555) 123-4567',
        email: 'drsmith@example.com'
      },
      address: member.address || '',
      emergencyContact: patientData.emergencyContact || {
        name: members[0].name,
        phone: members[0].phone,
        relationship: 'Family'
      },
      preferredHospital: patientData.preferredHospital || 'General Hospital',
      medicalConditions: patientData.medicalConditions || [],
      allergies: patientData.allergies || [],
      bloodType: patientData.bloodType || 'Unknown',
      photoUrl: member.photoUrl,
      patientId: `PT-${Date.now().toString().substring(7)}`,
      // Link back to family member record
      familyMemberId: familyMemberId,
      // Camera access settings
      cameras: patientData.cameras || [
        { 
          id: 'lf-living-room', 
          name: 'Living Room', 
          streamUrl: 'rtsp://example.com/livingroom', 
          enabled: true,
          wsPort: 9002,
          streamActive: true
        },
        { 
          id: 'lf-bedroom', 
          name: 'Bedroom', 
          streamUrl: 'rtsp://example.com/bedroom', 
          enabled: true,
          wsPort: 9003,
          streamActive: true
        },
        { 
          id: 'onvif-litokam', 
          name: 'Litokam LF-C1t', 
          type: 'ONVIF Camera',
          ipAddress: '192.168.1.1',
          username: 'admin',
          onvifPort: '8000',
          rtspPort: '5543',
          streamUrl: 'rtsp://admin:123456@192.168.1.1:5543/stream1',
          onvifUrl: 'http://192.168.1.1:8000/onvif/device_service',
          status: 'online',
          connection: 'Wired',
          lastSeen: 'Just now',
          enabled: true,
          motionDetection: true,
          model: 'LF-C1t',
          resolution: '2k+2.4G+BT',
          ptzSupported: true,
          wsPort: 9001,
          streamActive: true // Indicates this camera has an active stream
        }
      ] // Cameras
    };
    
    // Add to patients
    const updatedPatients = [...patients, newPatient];
    localStorageAPI.setItem('patients', updatedPatients);
    
    // Update the family member to indicate they are now a patient
    const updatedMembers = members.map(m => 
      m.id === familyMemberId 
        ? { ...m, isPatient: true, patientId: newPatient.id }
        : m
    );
    localStorageAPI.setItem('familyMembers', updatedMembers);
    
    // Create connection for other family members to access this patient
    const connections = localStorageAPI.getItem('patientFamilyConnections');
    const otherFamilyMembers = members.filter(m => m.id !== familyMemberId);
    
    const newConnections = otherFamilyMembers.map(m => ({
      patientId: newPatient.id,
      familyMemberId: m.id,
      relationship: m.relation || 'Family',
      accessLevel: 'full'
    }));
    
    localStorageAPI.setItem('patientFamilyConnections', [...connections, ...newConnections]);
    
    return Promise.resolve({ data: newPatient });
  }
};

export default {
  userService,
  patientService
};