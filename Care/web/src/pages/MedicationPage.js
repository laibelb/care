import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import '../styles/MedicationPage.css';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Box,
  Button,
  IconButton,
  Chip,
  Divider,
  Paper,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Tooltip,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Avatar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Snackbar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList'; 
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AlarmIcon from '@mui/icons-material/Alarm';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import BreakfastDiningIcon from '@mui/icons-material/BreakfastDining';
import DinnerDiningIcon from '@mui/icons-material/DinnerDining';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import MedicationIcon from '@mui/icons-material/Medication';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HelpIcon from '@mui/icons-material/Help';
import NotificationsIcon from '@mui/icons-material/Notifications';
import RefreshIcon from '@mui/icons-material/Refresh';
import HistoryIcon from '@mui/icons-material/History';

function MedicationPage() {
  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [tabValue, setTabValue] = useState(0);
  const [openMedDialog, setOpenMedDialog] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [currentMed, setCurrentMed] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  // Medication categories
  const categories = [
    { id: 'all', name: 'All Medications', color: '#2196f3' },
    { id: 'kidney', name: 'Kidney & Dialysis', color: '#9c27b0' },
    { id: 'diabetes', name: 'Diabetes Management', color: '#4caf50' },
    { id: 'blood-pressure', name: 'Blood Pressure & Heart', color: '#f44336' },
    { id: 'vitamins', name: 'Vitamins & Supplements', color: '#ff9800' },
    { id: 'other', name: 'Other Medications', color: '#607d8b' }
  ];
  
  // Medication times
  const medTimes = [
    { id: 'morning', name: 'Morning', icon: <BreakfastDiningIcon /> },
    { id: 'noon', name: 'Noon', icon: <LunchDiningIcon /> },
    { id: 'evening', name: 'Evening', icon: <DinnerDiningIcon /> },
    { id: 'night', name: 'Night', icon: <AlarmIcon /> },
    { id: 'dialysis', name: 'Dialysis Days', icon: <WaterDropIcon /> }
  ];
  
  // Mock medications data for a diabetic dialysis patient
  const [medications, setMedications] = useState([
    {
      id: 1,
      name: 'Epoetin Alfa (Epogen)',
      generic: 'Epoetin Alfa',
      dosage: '4,000 units',
      frequency: 'Three times weekly (dialysis days)',
      time: 'dialysis',
      category: 'kidney',
      purpose: 'Treats anemia in kidney disease',
      instructions: 'Administered during dialysis treatment',
      sideEffects: 'High blood pressure, headache, joint pain, nausea',
      pillColor: 'white',
      isInjection: true,
      isRefillNeeded: false,
      refillDate: '2025-04-10',
      quantity: 12,
      nextDose: '2025-02-28T09:00:00',
      lastTaken: '2025-02-26T09:00:00',
      prescribedBy: 'Dr. Sarah Goldstein (Nephrologist)',
      imagePath: '/images/medications/epogen.jpg',
      notes: 'Refrigerate until use. Given during dialysis treatment by staff.'
    },
    {
      id: 2,
      name: 'Sevelamer (Renvela)',
      generic: 'Sevelamer Carbonate',
      dosage: '800mg',
      frequency: 'Three times daily with meals',
      time: 'morning,noon,evening',
      category: 'kidney',
      purpose: 'Phosphate binder that prevents high phosphorus levels',
      instructions: 'Take with meals, swallow whole, do not chew',
      sideEffects: 'Nausea, vomiting, constipation, diarrhea',
      pillColor: 'white',
      isInjection: false,
      isRefillNeeded: false,
      refillDate: '2025-03-15',
      quantity: 90,
      nextDose: '2025-02-27T08:00:00',
      lastTaken: '2025-02-26T19:00:00',
      prescribedBy: 'Dr. Sarah Goldstein (Nephrologist)',
      imagePath: '/images/medications/renvela.jpg',
      notes: 'Must be taken with food to bind phosphorus.'
    },
    {
      id: 3,
      name: 'Calcitriol (Rocaltrol)',
      generic: 'Calcitriol',
      dosage: '0.5mcg',
      frequency: 'Once daily',
      time: 'evening',
      category: 'kidney',
      purpose: 'Active form of vitamin D that helps regulate calcium',
      instructions: 'Take in the evening with food',
      sideEffects: 'Headache, nausea, dry mouth, metallic taste',
      pillColor: 'orange',
      isInjection: false,
      isRefillNeeded: false,
      refillDate: '2025-04-05',
      quantity: 45,
      nextDose: '2025-02-27T19:00:00',
      lastTaken: '2025-02-26T19:00:00',
      prescribedBy: 'Dr. Sarah Goldstein (Nephrologist)',
      imagePath: '/images/medications/calcitriol.jpg',
      notes: 'Helps prevent bone disease associated with kidney failure.'
    },
    {
      id: 4,
      name: 'Insulin Glargine (Lantus)',
      generic: 'Insulin Glargine',
      dosage: '20 units',
      frequency: 'Once daily at bedtime',
      time: 'night',
      category: 'diabetes',
      purpose: 'Long-acting insulin for controlling blood sugar',
      instructions: 'Inject subcutaneously at the same time each night',
      sideEffects: 'Hypoglycemia, injection site reactions, weight gain',
      pillColor: '',
      isInjection: true,
      isRefillNeeded: true,
      refillDate: '2025-03-01',
      quantity: 14,
      nextDose: '2025-02-27T21:00:00',
      lastTaken: '2025-02-26T21:00:00',
      prescribedBy: 'Dr. Robert Chen (Endocrinologist)',
      imagePath: '/images/medications/lantus.jpg',
      notes: 'Store in refrigerator. Allow to reach room temperature before injecting.'
    },
    {
      id: 5,
      name: 'Insulin Aspart (NovoLog)',
      generic: 'Insulin Aspart',
      dosage: 'Variable based on carbs',
      frequency: 'Before meals',
      time: 'morning,noon,evening',
      category: 'diabetes',
      purpose: 'Rapid-acting insulin for mealtime blood sugar control',
      instructions: 'Inject 15 minutes before meals. Adjust dose based on carb intake.',
      sideEffects: 'Hypoglycemia, injection site reactions, weight gain',
      pillColor: '',
      isInjection: true,
      isRefillNeeded: false,
      refillDate: '2025-03-10',
      quantity: 28,
      nextDose: '2025-02-27T08:00:00',
      lastTaken: '2025-02-26T19:00:00',
      prescribedBy: 'Dr. Robert Chen (Endocrinologist)',
      imagePath: '/images/medications/novolog.jpg',
      notes: 'Keep track of carb intake to adjust dosage accordingly.'
    },
    {
      id: 6,
      name: 'Metoprolol (Lopressor)',
      generic: 'Metoprolol Tartrate',
      dosage: '25mg',
      frequency: 'Twice daily',
      time: 'morning,evening',
      category: 'blood-pressure',
      purpose: 'Beta-blocker for high blood pressure and heart conditions',
      instructions: 'Take with or without food at the same times each day',
      sideEffects: 'Dizziness, tiredness, slow heartbeat, depression',
      pillColor: 'blue',
      isInjection: false,
      isRefillNeeded: false,
      refillDate: '2025-03-20',
      quantity: 60,
      nextDose: '2025-02-27T08:00:00',
      lastTaken: '2025-02-26T19:00:00',
      prescribedBy: 'Dr. Lisa Wang (Cardiologist)',
      imagePath: '/images/medications/metoprolol.jpg',
      notes: 'Take regularly to maintain blood pressure control.'
    },
    {
      id: 7,
      name: 'Amlodipine (Norvasc)',
      generic: 'Amlodipine Besylate',
      dosage: '5mg',
      frequency: 'Once daily',
      time: 'morning',
      category: 'blood-pressure',
      purpose: 'Calcium channel blocker for high blood pressure',
      instructions: 'Take in the morning with or without food',
      sideEffects: 'Swelling in ankles or feet, flushing, headache',
      pillColor: 'white',
      isInjection: false,
      isRefillNeeded: false,
      refillDate: '2025-03-25',
      quantity: 45,
      nextDose: '2025-02-27T08:00:00',
      lastTaken: '2025-02-26T08:00:00',
      prescribedBy: 'Dr. Lisa Wang (Cardiologist)',
      imagePath: '/images/medications/amlodipine.jpg',
      notes: 'Helps lower blood pressure by relaxing blood vessels.'
    },
    {
      id: 8,
      name: 'Furosemide (Lasix)',
      generic: 'Furosemide',
      dosage: '40mg',
      frequency: 'Once daily',
      time: 'morning',
      category: 'kidney',
      purpose: 'Loop diuretic that helps remove excess fluid',
      instructions: 'Take in the morning to avoid nighttime urination',
      sideEffects: 'Frequent urination, dizziness, dehydration, electrolyte imbalances',
      pillColor: 'yellow',
      isInjection: false,
      isRefillNeeded: false,
      refillDate: '2025-03-15',
      quantity: 45,
      nextDose: '2025-02-27T08:00:00',
      lastTaken: '2025-02-26T08:00:00',
      prescribedBy: 'Dr. Sarah Goldstein (Nephrologist)',
      imagePath: '/images/medications/furosemide.jpg',
      notes: 'Take early in the day to prevent sleep interruption.'
    },
    {
      id: 9,
      name: 'Metformin (Glucophage)',
      generic: 'Metformin Hydrochloride',
      dosage: '500mg',
      frequency: 'Twice daily with meals',
      time: 'morning,evening',
      category: 'diabetes',
      purpose: 'Oral diabetes medication that lowers blood sugar',
      instructions: 'Take with breakfast and dinner',
      sideEffects: 'Nausea, diarrhea, stomach upset, metallic taste',
      pillColor: 'white',
      isInjection: false,
      isRefillNeeded: false,
      refillDate: '2025-03-10',
      quantity: 60,
      nextDose: '2025-02-27T08:00:00',
      lastTaken: '2025-02-26T19:00:00',
      prescribedBy: 'Dr. Robert Chen (Endocrinologist)',
      imagePath: '/images/medications/metformin.jpg',
      notes: 'Take with food to minimize stomach upset.'
    },
    {
      id: 10,
      name: 'Atorvastatin (Lipitor)',
      generic: 'Atorvastatin Calcium',
      dosage: '20mg',
      frequency: 'Once daily',
      time: 'evening',
      category: 'blood-pressure',
      purpose: 'Statin medication that lowers cholesterol',
      instructions: 'Take in the evening, with or without food',
      sideEffects: 'Muscle pain, liver problems, digestive issues',
      pillColor: 'white',
      isInjection: false,
      isRefillNeeded: false,
      refillDate: '2025-04-01',
      quantity: 45,
      nextDose: '2025-02-27T19:00:00',
      lastTaken: '2025-02-26T19:00:00',
      prescribedBy: 'Dr. Lisa Wang (Cardiologist)',
      imagePath: '/images/medications/atorvastatin.jpg',
      notes: 'Avoid grapefruit juice while taking this medication.'
    },
    {
      id: 11,
      name: 'Iron (Ferrous Sulfate)',
      generic: 'Ferrous Sulfate',
      dosage: '325mg',
      frequency: 'Once daily',
      time: 'morning',
      category: 'vitamins',
      purpose: 'Iron supplement for anemia',
      instructions: 'Take with food and orange juice to enhance absorption',
      sideEffects: 'Constipation, dark stools, stomach upset',
      pillColor: 'green',
      isInjection: false,
      isRefillNeeded: false,
      refillDate: '2025-03-20',
      quantity: 60,
      nextDose: '2025-02-27T08:00:00',
      lastTaken: '2025-02-26T08:00:00',
      prescribedBy: 'Dr. Sarah Goldstein (Nephrologist)',
      imagePath: '/images/medications/iron.jpg',
      notes: 'Don\'t take with dairy or calcium supplements.'
    },
    {
      id: 12,
      name: 'Folic Acid',
      generic: 'Folic Acid',
      dosage: '1mg',
      frequency: 'Once daily',
      time: 'morning',
      category: 'vitamins',
      purpose: 'B vitamin that helps with red blood cell formation',
      instructions: 'Take with food or on an empty stomach',
      sideEffects: 'Generally well-tolerated, may cause upset stomach',
      pillColor: 'yellow',
      isInjection: false,
      isRefillNeeded: false,
      refillDate: '2025-04-10',
      quantity: 60,
      nextDose: '2025-02-27T08:00:00',
      lastTaken: '2025-02-26T08:00:00',
      prescribedBy: 'Dr. Sarah Goldstein (Nephrologist)',
      imagePath: '/images/medications/folicacid.jpg',
      notes: 'Important for red blood cell production.'
    },
    {
      id: 13,
      name: 'Paricalcitol (Zemplar)',
      generic: 'Paricalcitol',
      dosage: '2mcg',
      frequency: 'Three times weekly (dialysis days)',
      time: 'dialysis',
      category: 'kidney',
      purpose: 'Vitamin D analog that helps control parathyroid hormone levels',
      instructions: 'Take on dialysis days or as directed',
      sideEffects: 'Nausea, vomiting, dizziness, headache',
      pillColor: 'tan',
      isInjection: false,
      isRefillNeeded: false,
      refillDate: '2025-03-15',
      quantity: 30,
      nextDose: '2025-02-28T09:00:00',
      lastTaken: '2025-02-26T09:00:00',
      prescribedBy: 'Dr. Sarah Goldstein (Nephrologist)',
      imagePath: '/images/medications/paricalcitol.jpg',
      notes: 'Helps prevent bone disease in kidney patients.'
    },
    {
      id: 14,
      name: 'Cinacalcet (Sensipar)',
      generic: 'Cinacalcet Hydrochloride',
      dosage: '30mg',
      frequency: 'Once daily',
      time: 'evening',
      category: 'kidney',
      purpose: 'Calcimimetic that helps control parathyroid hormone levels',
      instructions: 'Take with food or shortly after a meal',
      sideEffects: 'Nausea, vomiting, diarrhea, muscle pain',
      pillColor: 'green',
      isInjection: false,
      isRefillNeeded: false,
      refillDate: '2025-04-05',
      quantity: 45,
      nextDose: '2025-02-27T19:00:00',
      lastTaken: '2025-02-26T19:00:00',
      prescribedBy: 'Dr. Sarah Goldstein (Nephrologist)',
      imagePath: '/images/medications/cinacalcet.jpg',
      notes: 'Regulates calcium levels in the blood.'
    },
    {
      id: 15,
      name: 'Acetaminophen (Tylenol)',
      generic: 'Acetaminophen',
      dosage: '500mg',
      frequency: 'As needed for pain, up to 4 times daily',
      time: 'morning,noon,evening,night',
      category: 'other',
      purpose: 'Pain reliever and fever reducer',
      instructions: 'Take as needed, do not exceed 4,000mg in 24 hours',
      sideEffects: 'Liver damage with high doses or alcohol use',
      pillColor: 'white',
      isInjection: false,
      isRefillNeeded: false,
      refillDate: '2025-04-15',
      quantity: 60,
      nextDose: 'As needed',
      lastTaken: '2025-02-25T14:00:00',
      prescribedBy: 'Dr. Michael Johnson (Primary Care)',
      imagePath: '/images/medications/acetaminophen.jpg',
      notes: 'Safer than NSAIDs for kidney patients. Use only when needed.'
    },
    {
      id: 16,
      name: 'Omeprazole (Prilosec)',
      generic: 'Omeprazole',
      dosage: '20mg',
      frequency: 'Once daily',
      time: 'morning',
      category: 'other',
      purpose: 'Proton pump inhibitor for acid reflux and heartburn',
      instructions: 'Take 30 minutes before breakfast',
      sideEffects: 'Headache, stomach pain, nausea, diarrhea',
      pillColor: 'purple',
      isInjection: false,
      isRefillNeeded: false,
      refillDate: '2025-03-25',
      quantity: 45,
      nextDose: '2025-02-27T07:30:00',
      lastTaken: '2025-02-26T07:30:00',
      prescribedBy: 'Dr. Michael Johnson (Primary Care)',
      imagePath: '/images/medications/omeprazole.jpg',
      notes: 'Swallow whole, do not crush or chew.'
    },
    {
      id: 17,
      name: 'B Complex Vitamin',
      generic: 'Vitamin B Complex',
      dosage: '1 tablet',
      frequency: 'Once daily',
      time: 'morning',
      category: 'vitamins',
      purpose: 'Supplement for B vitamins that may be lost during dialysis',
      instructions: 'Take with breakfast',
      sideEffects: 'Bright yellow urine, mild nausea',
      pillColor: 'yellow',
      isInjection: false,
      isRefillNeeded: false,
      refillDate: '2025-04-01',
      quantity: 90,
      nextDose: '2025-02-27T08:00:00',
      lastTaken: '2025-02-26T08:00:00',
      prescribedBy: 'Dr. Sarah Goldstein (Nephrologist)',
      imagePath: '/images/medications/bcomplex.jpg',
      notes: 'Provides essential B vitamins that may be depleted during dialysis.'
    },
    {
      id: 18,
      name: 'Gabapentin (Neurontin)',
      generic: 'Gabapentin',
      dosage: '300mg',
      frequency: 'Three times daily',
      time: 'morning,noon,evening',
      category: 'other',
      purpose: 'Treats nerve pain that may occur with diabetes',
      instructions: 'Take with food to avoid stomach upset',
      sideEffects: 'Drowsiness, dizziness, unsteadiness, fatigue',
      pillColor: 'orange',
      isInjection: false,
      isRefillNeeded: false,
      refillDate: '2025-03-15',
      quantity: 90,
      nextDose: '2025-02-27T08:00:00',
      lastTaken: '2025-02-26T19:00:00',
      prescribedBy: 'Dr. Robert Chen (Endocrinologist)',
      imagePath: '/images/medications/gabapentin.jpg',
      notes: 'May cause drowsiness. Do not drive until you know how it affects you.'
    },
    {
      id: 19,
      name: 'Aspirin (Low Dose)',
      generic: 'Acetylsalicylic Acid',
      dosage: '81mg',
      frequency: 'Once daily',
      time: 'morning',
      category: 'blood-pressure',
      purpose: 'Blood thinner to prevent heart attack and stroke',
      instructions: 'Take with breakfast',
      sideEffects: 'Stomach upset, risk of bleeding',
      pillColor: 'orange',
      isInjection: false,
      isRefillNeeded: false,
      refillDate: '2025-04-10',
      quantity: 180,
      nextDose: '2025-02-27T08:00:00',
      lastTaken: '2025-02-26T08:00:00',
      prescribedBy: 'Dr. Lisa Wang (Cardiologist)',
      imagePath: '/images/medications/aspirin.jpg',
      notes: 'Do not take additional aspirin or NSAIDs without consulting doctor.'
    },
    {
      id: 20,
      name: 'Allopurinol (Zyloprim)',
      generic: 'Allopurinol',
      dosage: '100mg',
      frequency: 'Once daily',
      time: 'morning',
      category: 'kidney',
      purpose: 'Prevents gout and manages uric acid levels',
      instructions: 'Take after breakfast with a full glass of water',
      sideEffects: 'Rash, drowsiness, diarrhea',
      pillColor: 'white',
      isInjection: false,
      isRefillNeeded: false,
      refillDate: '2025-04-05',
      quantity: 60,
      nextDose: '2025-02-27T08:00:00',
      lastTaken: '2025-02-26T08:00:00',
      prescribedBy: 'Dr. Sarah Goldstein (Nephrologist)',
      imagePath: '/images/medications/allopurinol.jpg',
      notes: 'Helps manage uric acid levels often affected by kidney disease.'
    },
    {
      id: 21,
      name: 'Darbepoetin Alfa (Aranesp)',
      generic: 'Darbepoetin Alfa',
      dosage: '60mcg',
      frequency: 'Once weekly',
      time: 'dialysis',
      category: 'kidney',
      purpose: 'Treats anemia in kidney disease, longer acting than Epogen',
      instructions: 'Administered during dialysis once per week',
      sideEffects: 'High blood pressure, headache, joint pain, nausea',
      pillColor: '',
      isInjection: true,
      isRefillNeeded: false,
      refillDate: '2025-03-20',
      quantity: 8,
      nextDose: '2025-02-28T09:00:00',
      lastTaken: '2025-02-21T09:00:00',
      prescribedBy: 'Dr. Sarah Goldstein (Nephrologist)',
      imagePath: '/images/medications/aranesp.jpg',
      notes: 'Alternative to Epogen that requires less frequent dosing.'
    },
    {
      id: 22,
      name: 'Empagliflozin (Jardiance)',
      generic: 'Empagliflozin',
      dosage: '10mg',
      frequency: 'Once daily',
      time: 'morning',
      category: 'diabetes',
      purpose: 'SGLT2 inhibitor for diabetes that also has kidney and heart benefits',
      instructions: 'Take in the morning with or without food',
      sideEffects: 'Urinary tract infections, yeast infections, dehydration',
      pillColor: 'pink',
      isInjection: false,
      isRefillNeeded: false,
      refillDate: '2025-03-30',
      quantity: 45,
      nextDose: '2025-02-27T08:00:00',
      lastTaken: '2025-02-26T08:00:00',
      prescribedBy: 'Dr. Robert Chen (Endocrinologist)',
      imagePath: '/images/medications/empagliflozin.jpg',
      notes: 'Newer diabetes medication that may help protect kidneys and heart.'
    },
    {
      id: 23,
      name: 'Clopidogrel (Plavix)',
      generic: 'Clopidogrel',
      dosage: '75mg',
      frequency: 'Once daily',
      time: 'evening',
      category: 'blood-pressure',
      purpose: 'Blood thinner to prevent clots, heart attack, and stroke',
      instructions: 'Take at the same time each evening',
      sideEffects: 'Bruising, bleeding, stomach pain',
      pillColor: 'pink',
      isInjection: false,
      isRefillNeeded: false,
      refillDate: '2025-04-10',
      quantity: 45,
      nextDose: '2025-02-27T19:00:00',
      lastTaken: '2025-02-26T19:00:00',
      prescribedBy: 'Dr. Lisa Wang (Cardiologist)',
      imagePath: '/images/medications/clopidogrel.jpg',
      notes: 'Do not stop taking without consulting your doctor.'
    },
    {
      id: 24,
      name: 'Ergocalciferol (Vitamin D2)',
      generic: 'Vitamin D2',
      dosage: '50,000 IU',
      frequency: 'Once weekly',
      time: 'morning',
      category: 'vitamins',
      purpose: 'High-dose vitamin D supplement for severe deficiency',
      instructions: 'Take once weekly with a fat-containing meal',
      sideEffects: 'Generally well-tolerated, may cause weakness or headache at high doses',
      pillColor: 'yellow',
      isInjection: false,
      isRefillNeeded: false,
      refillDate: '2025-04-15',
      quantity: 16,
      nextDose: '2025-03-02T08:00:00',
      lastTaken: '2025-02-23T08:00:00',
      prescribedBy: 'Dr. Sarah Goldstein (Nephrologist)',
      imagePath: '/images/medications/vitamind.jpg',
      notes: 'High-dose vitamin D therapy to correct deficiency common in kidney disease.'
    },
    {
      id: 25,
      name: 'Calcium Acetate (PhosLo)',
      generic: 'Calcium Acetate',
      dosage: '667mg',
      frequency: 'Three times daily with meals',
      time: 'morning,noon,evening',
      category: 'kidney',
      purpose: 'Phosphate binder that helps control phosphorus levels',
      instructions: 'Take with each meal, swallow whole with water',
      sideEffects: 'Nausea, constipation, headache',
      pillColor: 'white',
      isInjection: false,
      isRefillNeeded: false,
      refillDate: '2025-03-15',
      quantity: 90,
      nextDose: '2025-02-27T08:00:00',
      lastTaken: '2025-02-26T19:00:00',
      prescribedBy: 'Dr. Sarah Goldstein (Nephrologist)',
      imagePath: '/images/medications/calciumacetate.jpg',
      notes: 'Alternative phosphate binder. Must be taken with meals to be effective.'
    }
  ]);
  
  // Dialog handlers
  const handleOpenMedDialog = (med) => {
    setCurrentMed(med);
    setOpenMedDialog(true);
  };
  
  const handleCloseMedDialog = () => {
    setOpenMedDialog(false);
  };
  
  const handleOpenInfoDialog = (med) => {
    setCurrentMed(med);
    setOpenInfoDialog(true);
  };
  
  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
  };
  
  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Medication taken handler
  const handleMedicationTaken = (medId) => {
    const updatedMedications = medications.map(med => {
      if (med.id === medId) {
        const now = new Date();
        return { 
          ...med, 
          lastTaken: now.toISOString(),
          nextDose: calculateNextDose(med, now)
        };
      }
      return med;
    });
    
    setMedications(updatedMedications);
    showSnackbar('Medication marked as taken', 'success');
  };
  
  // Calculate next dose time based on frequency
  const calculateNextDose = (med, currentTime) => {
    const now = currentTime || new Date();
    let nextDose = new Date(now);
    
    if (med.frequency.includes('daily')) {
      nextDose.setDate(nextDose.getDate() + 1);
    } else if (med.frequency.includes('twice daily')) {
      // If morning dose taken, set for evening, if evening dose taken, set for next morning
      const hour = now.getHours();
      if (hour < 12) {
        nextDose.setHours(19, 0, 0);
      } else {
        nextDose.setDate(nextDose.getDate() + 1);
        nextDose.setHours(8, 0, 0);
      }
    } else if (med.frequency.includes('weekly')) {
      nextDose.setDate(nextDose.getDate() + 7);
    } else if (med.frequency.includes('dialysis days')) {
      // Set next dialysis day (M/W/F)
      const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
      if (day === 1) { // Monday -> Wednesday
        nextDose.setDate(nextDose.getDate() + 2);
      } else if (day === 3) { // Wednesday -> Friday
        nextDose.setDate(nextDose.getDate() + 2);
      } else { // Friday or other -> Monday
        nextDose.setDate(nextDose.getDate() + (8 - day) % 7);
      }
    }
    
    return nextDose.toISOString();
  };
  
  // Filter medications based on category and search
  const getFilteredMedications = () => {
    return medications.filter(med => {
      const matchesCategory = filterCategory === 'all' || med.category === filterCategory;
      const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           (med.generic && med.generic.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  };

  // Group medications by scheduled time
  const getMedicationsByTime = () => {
    const timeMap = {};
    
    medTimes.forEach(time => {
      timeMap[time.id] = {
        ...time,
        medications: getFilteredMedications().filter(med => med.time.includes(time.id))
      };
    });
    
    return timeMap;
  };
  
  // Show snackbar message
  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  
  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Format dates for display
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'As needed') return 'As needed';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };
  
  // Get medication time of day
  const getMedicationTimes = (timeString) => {
    const times = timeString.split(',');
    return times.map(time => {
      const timeData = medTimes.find(t => t.id === time);
      return timeData ? (
        <Chip 
          key={time}
          icon={timeData.icon} 
          label={timeData.name}
          size="small"
          sx={{ m: 0.5 }}
        />
      ) : null;
    });
  };

  // Check if medication is due soon (within next 2 hours)
  const isDueSoon = (nextDoseStr) => {
    if (!nextDoseStr || nextDoseStr === 'As needed') return false;
    
    const nextDose = new Date(nextDoseStr);
    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    return nextDose > now && nextDose <= twoHoursFromNow;
  };
  
  // Get medicine icon
  const getMedicineIcon = (med) => {
    if (med.isInjection) {
      return <VaccinesIcon />;
    } else {
      return <MedicationIcon />;
    }
  };
  
  // Get category color
  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : '#2196f3';
  };
  
  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Medication Cabinet
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<RefreshIcon />}
            onClick={() => showSnackbar('Medication list refreshed', 'info')}
          >
            Refresh
          </Button>
        </Box>
        
        {/* Search and Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                placeholder="Search medications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={7}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                {categories.map(category => (
                  <Chip
                    key={category.id}
                    label={category.name}
                    onClick={() => setFilterCategory(category.id)}
                    variant={filterCategory === category.id ? 'filled' : 'outlined'}
                    color={filterCategory === category.id ? 'primary' : 'default'}
                    sx={{ 
                      borderColor: category.color,
                      backgroundColor: filterCategory === category.id ? category.color : 'transparent',
                      color: filterCategory === category.id ? 'white' : 'inherit'
                    }}
                  />
                ))}
              </Box>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Tabs */}
        <Box sx={{ mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="medication view tabs"
            sx={{ borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab icon={<AlarmIcon />} label="By Schedule" value={0} />
            <Tab icon={<LocalPharmacyIcon />} label="All Medications" value={1} />
          </Tabs>
        </Box>
        
        {/* Medication View - By Schedule */}
        {tabValue === 0 && (
          <Box>
            {Object.values(getMedicationsByTime()).map((timeGroup) => (
              timeGroup.medications.length > 0 ? (
                <Box key={timeGroup.id} sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: 'primary.light', mr: 2 }}>{timeGroup.icon}</Avatar>
                    <Typography variant="h5" component="h2">
                      {timeGroup.name} Medications
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    {timeGroup.medications.map((med) => (
                      <Grid item xs={12} sm={6} md={4} key={med.id}>
                        <Card 
                          elevation={2} 
                          sx={{ 
                            height: '100%', 
                            display: 'flex', 
                            flexDirection: 'column',
                            position: 'relative',
                            borderLeft: `5px solid ${getCategoryColor(med.category)}`,
                            ...(isDueSoon(med.nextDose) ? {
                              borderColor: 'warning.main',
                              boxShadow: '0 0 8px rgba(255, 153, 0, 0.6)'
                            } : {})
                          }}
                        >
                          {med.isRefillNeeded && (
                            <Chip
                              label="Refill Soon"
                              color="error"
                              size="small"
                              sx={{ 
                                position: 'absolute', 
                                top: 8, 
                                right: 8,
                                zIndex: 1
                              }}
                            />
                          )}
                          
                          {isDueSoon(med.nextDose) && (
                            <Chip
                              icon={<NotificationsIcon />}
                              label="Due Soon"
                              color="warning"
                              size="small"
                              sx={{ 
                                position: 'absolute', 
                                top: med.isRefillNeeded ? 40 : 8, 
                                right: 8,
                                zIndex: 1
                              }}
                            />
                          )}
                          
                          <CardContent sx={{ flexGrow: 1, pt: med.isRefillNeeded || isDueSoon(med.nextDose) ? 4 : 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Avatar 
                                sx={{ 
                                  bgcolor: getCategoryColor(med.category) + '20', 
                                  color: getCategoryColor(med.category),
                                  mr: 2
                                }}
                              >
                                {getMedicineIcon(med)}
                              </Avatar>
                              <Box>
                                <Typography variant="h6" component="h3" sx={{ fontWeight: 'medium', lineHeight: 1.2 }}>
                                  {med.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {med.generic || med.name}
                                </Typography>
                              </Box>
                            </Box>
                            
                            <Typography variant="body1" fontWeight="medium" sx={{ mb: 0.5 }}>
                              {med.dosage}
                            </Typography>
                            
                            <Typography variant="body2" sx={{ mb: 1.5 }}>
                              {med.frequency}
                            </Typography>
                            
                            <Divider sx={{ my: 1.5 }} />
                            
                            <Box sx={{ mb: 1.5 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                                <AlarmIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                                Next dose: {formatDate(med.nextDose)}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                                <HistoryIcon fontSize="small" sx={{ mr: 1, opacity: 0.7 }} />
                                Last taken: {formatDate(med.lastTaken)}
                              </Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', mt: 1 }}>
                              <Chip 
                                label={categories.find(cat => cat.id === med.category)?.name || med.category} 
                                size="small"
                                sx={{ m: 0.5, bgcolor: getCategoryColor(med.category) + '20', color: getCategoryColor(med.category) }}
                              />
                              {med.isInjection && (
                                <Chip
                                  icon={<VaccinesIcon />}
                                  label="Injection"
                                  size="small"
                                  sx={{ m: 0.5 }}
                                />
                              )}
                            </Box>
                          </CardContent>
                          
                          <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                            <Button 
                              size="small" 
                              onClick={() => handleOpenInfoDialog(med)}
                              startIcon={<InfoIcon />}
                            >
                              Details
                            </Button>
                            
                            <Button
                              variant="contained"
                              color="primary"
                              size="small"
                              onClick={() => handleMedicationTaken(med.id)}
                              disabled={med.nextDose === 'As needed'}
                              startIcon={<CheckCircleIcon />}
                            >
                              Mark Taken
                            </Button>
                          </CardActions>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ) : null
            ))}
          </Box>
        )}
        
        {/* Medication View - All Medications */}
        {tabValue === 1 && (
          <Grid container spacing={2}>
            {getFilteredMedications().map((med) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={med.id}>
                <Card 
                  elevation={2} 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    position: 'relative',
                    borderLeft: `5px solid ${getCategoryColor(med.category)}`
                  }}
                >
                  {med.isRefillNeeded && (
                    <Chip
                      label="Refill Soon"
                      color="error"
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: 8, 
                        right: 8
                      }}
                    />
                  )}
                  
                  <CardContent sx={{ flexGrow: 1, pt: med.isRefillNeeded ? 4 : 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                      <Avatar 
                        sx={{ 
                          bgcolor: getCategoryColor(med.category) + '20', 
                          color: getCategoryColor(med.category),
                          width: 32,
                          height: 32,
                          mr: 1.5
                        }}
                      >
                        {getMedicineIcon(med)}
                      </Avatar>
                      <Typography variant="h6" component="h3" sx={{ fontWeight: 'medium', fontSize: '1rem', lineHeight: 1.2 }}>
                        {med.name}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {med.dosage} • {med.frequency}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', mb: 1, mt: 1.5 }}>
                      {getMedicationTimes(med.time)}
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1, fontSize: '0.75rem' }}>
                      Prescribed by {med.prescribedBy}
                    </Typography>
                  </CardContent>
                  
                  <CardActions sx={{ p: 2, pt: 0, justifyContent: 'center' }}>
                    <Button 
                      size="small" 
                      fullWidth
                      variant="outlined"
                      onClick={() => handleOpenInfoDialog(med)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
      
      {/* Medication Detail Dialog */}
      <Dialog
        open={openInfoDialog}
        onClose={handleCloseInfoDialog}
        maxWidth="sm"
        fullWidth
      >
        {currentMed && (
          <>
            <DialogTitle sx={{ pb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar 
                  sx={{ 
                    bgcolor: getCategoryColor(currentMed.category) + '20', 
                    color: getCategoryColor(currentMed.category),
                    mr: 2
                  }}
                >
                  {getMedicineIcon(currentMed)}
                </Avatar>
                <Box>
                  <Typography variant="h6">{currentMed.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {currentMed.generic}
                  </Typography>
                </Box>
              </Box>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Dosage
                  </Typography>
                  <Typography variant="body1" gutterBottom sx={{ fontWeight: 'medium' }}>
                    {currentMed.dosage}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Frequency
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentMed.frequency}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Purpose
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {currentMed.purpose}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Instructions
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {currentMed.instructions}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Side Effects
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {currentMed.sideEffects}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Next Dose
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatDate(currentMed.nextDose)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Last Taken
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {formatDate(currentMed.lastTaken)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Current Supply
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentMed.quantity} {currentMed.isInjection ? 'doses' : 'tablets'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Refill Date
                  </Typography>
                  <Typography 
                    variant="body1" 
                    gutterBottom
                    color={currentMed.isRefillNeeded ? 'error.main' : 'inherit'}
                  >
                    {currentMed.refillDate}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Notes
                  </Typography>
                  <Typography variant="body1" paragraph>
                    {currentMed.notes}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    <Chip 
                      label={categories.find(cat => cat.id === currentMed.category)?.name} 
                      sx={{ bgcolor: getCategoryColor(currentMed.category) + '20', color: getCategoryColor(currentMed.category) }}
                    />
                    {currentMed.isInjection && <Chip icon={<VaccinesIcon />} label="Injection" />}
                    {currentMed.isRefillNeeded && <Chip icon={<WarningIcon />} label="Refill Soon" color="error" />}
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseInfoDialog}>Close</Button>
              <Button 
                variant="contained"
                color="primary"
                onClick={() => {
                  handleMedicationTaken(currentMed.id);
                  handleCloseInfoDialog();
                }}
                disabled={currentMed.nextDose === 'As needed'}
              >
                Mark as Taken
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default MedicationPage;