import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import '../styles/HealthTrackingPage.css';

function HealthTrackingPage() {
  const [healthEvents, setHealthEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    type: 'Vital Signs',
    notes: '',
    vitals: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      bloodSugar: '',
      weight: '',
      oxygenLevel: ''
    }
  });
  
  // Mock data loading
  useEffect(() => {
    // Fetch health events
    setHealthEvents([
      { 
        id: '1', 
        date: '2025-02-24T09:30:00', 
        type: 'Vital Signs', 
        notes: 'Morning check',
        vitals: {
          bloodPressure: '120/80',
          heartRate: '72',
          temperature: '98.6',
          bloodSugar: '110',
          weight: '165',
          oxygenLevel: '98'
        }
      },
      { 
        id: '2', 
        date: '2025-02-20T14:00:00', 
        type: 'Doctor Visit', 
        notes: 'Annual physical with Dr. Chen. Discussed arthritis pain in knees.',
        vitals: {
          bloodPressure: '124/82',
          heartRate: '76',
          temperature: '98.4',
          bloodSugar: '',
          weight: '164',
          oxygenLevel: ''
        } 
      },
      { 
        id: '3', 
        date: '2025-02-18T10:15:00', 
        type: 'Symptom', 
        notes: 'Reported slight dizziness when standing up quickly. Lasted about 10 seconds.',
        vitals: {
          bloodPressure: '118/76',
          heartRate: '80',
          temperature: '',
          bloodSugar: '',
          weight: '',
          oxygenLevel: ''
        }
      },
      { 
        id: '4', 
        date: '2025-02-15T09:00:00', 
        type: 'Vital Signs', 
        notes: 'Morning check',
        vitals: {
          bloodPressure: '122/78',
          heartRate: '70',
          temperature: '98.6',
          bloodSugar: '108',
          weight: '166',
          oxygenLevel: '97'
        }
      }
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value
    });
  };

  const handleVitalChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      vitals: {
        ...newEvent.vitals,
        [name]: value
      }
    });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    
    // Create a new health event
    const event = {
      id: Date.now().toString(), // temporary ID for mock data
      date: `${newEvent.date}T${newEvent.time}:00`,
      type: newEvent.type,
      notes: newEvent.notes,
      vitals: newEvent.vitals
    };
    
    // Add to the health events array
    setHealthEvents([event, ...healthEvents]);
    
    // Reset form - except keep date and time current
    setNewEvent({
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      type: 'Vital Signs',
      notes: '',
      vitals: {
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        bloodSugar: '',
        weight: '',
        oxygenLevel: ''
      }
    });
  };

  // Function to display vital signs for a health event
  const renderVitals = (vitals) => {
    const vitalComponents = [];
    
    if (vitals.bloodPressure) {
      vitalComponents.push(
        <div key="bp" className="vital-item">
          <span className="vital-label">BP:</span> {vitals.bloodPressure}
        </div>
      );
    }
    
    if (vitals.heartRate) {
      vitalComponents.push(
        <div key="hr" className="vital-item">
          <span className="vital-label">HR:</span> {vitals.heartRate} bpm
        </div>
      );
    }
    
    if (vitals.temperature) {
      vitalComponents.push(
        <div key="temp" className="vital-item">
          <span className="vital-label">Temp:</span> {vitals.temperature}°F
        </div>
      );
    }
    
    if (vitals.bloodSugar) {
      vitalComponents.push(
        <div key="bs" className="vital-item">
          <span className="vital-label">Glucose:</span> {vitals.bloodSugar} mg/dL
        </div>
      );
    }
    
    if (vitals.weight) {
      vitalComponents.push(
        <div key="weight" className="vital-item">
          <span className="vital-label">Weight:</span> {vitals.weight} lbs
        </div>
      );
    }
    
    if (vitals.oxygenLevel) {
      vitalComponents.push(
        <div key="o2" className="vital-item">
          <span className="vital-label">O₂:</span> {vitals.oxygenLevel}%
        </div>
      );
    }
    
    return (
      <div className="vitals-container">
        {vitalComponents.length > 0 ? vitalComponents : <em>No vitals recorded</em>}
      </div>
    );
  };

  return (
    <div className="health-tracking-page">
      <Header user={{ name: 'Jane Doe' }} onLogout={() => console.log('logout')} />
      
      <main>
        <h2>Health Tracking</h2>
        
        <div className="add-event-section">
          <h3>Record New Health Event</h3>
          <form onSubmit={handleAddEvent}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input 
                  type="date" 
                  id="date" 
                  name="date" 
                  value={newEvent.date} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="time">Time</label>
                <input 
                  type="time" 
                  id="time" 
                  name="time" 
                  value={newEvent.time} 
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="type">Event Type</label>
                <select 
                  id="type" 
                  name="type" 
                  value={newEvent.type} 
                  onChange={handleInputChange}
                >
                  <option>Vital Signs</option>
                  <option>Doctor Visit</option>
                  <option>Hospital Visit</option>
                  <option>Symptom</option>
                  <option>Medication Change</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            
            <h4>Vital Signs</h4>
            <div className="vitals-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bloodPressure">Blood Pressure</label>
                  <input 
                    type="text" 
                    id="bloodPressure" 
                    name="bloodPressure" 
                    value={newEvent.vitals.bloodPressure} 
                    onChange={handleVitalChange}
                    placeholder="e.g., 120/80"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="heartRate">Heart Rate (bpm)</label>
                  <input 
                    type="text" 
                    id="heartRate" 
                    name="heartRate" 
                    value={newEvent.vitals.heartRate} 
                    onChange={handleVitalChange}
                    placeholder="e.g., 72"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="temperature">Temperature (°F)</label>
                  <input 
                    type="text" 
                    id="temperature" 
                    name="temperature" 
                    value={newEvent.vitals.temperature} 
                    onChange={handleVitalChange}
                    placeholder="e.g., 98.6"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="bloodSugar">Blood Sugar (mg/dL)</label>
                  <input 
                    type="text" 
                    id="bloodSugar" 
                    name="bloodSugar" 
                    value={newEvent.vitals.bloodSugar} 
                    onChange={handleVitalChange}
                    placeholder="e.g., 110"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="weight">Weight (lbs)</label>
                  <input 
                    type="text" 
                    id="weight" 
                    name="weight" 
                    value={newEvent.vitals.weight} 
                    onChange={handleVitalChange}
                    placeholder="e.g., 165"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="oxygenLevel">Oxygen Level (%)</label>
                  <input 
                    type="text" 
                    id="oxygenLevel" 
                    name="oxygenLevel" 
                    value={newEvent.vitals.oxygenLevel} 
                    onChange={handleVitalChange}
                    placeholder="e.g., 98"
                  />
                </div>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea 
                id="notes" 
                name="notes" 
                value={newEvent.notes} 
                onChange={handleInputChange}
                rows="3"
                placeholder="Details about the event, symptoms, observations, etc."
              ></textarea>
            </div>
            
            <button type="submit" className="add-event-btn">Record Health Event</button>
          </form>
        </div>
        
        <div className="event-history">
          <h3>Health Event History</h3>
          <div className="event-list">
            {healthEvents.map(event => (
              <div key={event.id} className="event-card">
                <div className="event-header">
                  <div className="event-type">{event.type}</div>
                  <div className="event-date">{new Date(event.date).toLocaleString()}</div>
                </div>
                
                <div className="event-content">
                  <div className="event-vitals">
                    <h4>Vitals</h4>
                    {renderVitals(event.vitals)}
                  </div>
                  
                  <div className="event-notes">
                    <h4>Notes</h4>
                    <p>{event.notes || <em>No notes recorded</em>}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default HealthTrackingPage;