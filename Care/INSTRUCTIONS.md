# Care App Mockup Viewing Instructions

This is a mockup of the Care app, designed to help families collaborate in caring for their aging parents. The mockup includes:

- Web UI with React
- Backend API with Node.js/Express
- Shared data models

## Prerequisites

- Node.js (v16+) and npm

## Setup Instructions

### 1. Install Dependencies

Open two terminal windows, one for the backend and one for the frontend.

For the backend:
```
cd Care/backend
npm install
```

For the web frontend:
```
cd Care/web
npm install
```

### 2. Start the Servers

#### Option 1: Using the convenience script

```
cd Care
chmod +x start.sh
./start.sh
```

#### Option 2: Starting servers separately

For the backend:
```
cd Care/backend
npm run dev
```

For the web frontend:
```
cd Care/web
npm start
```

### 3. Access the Mockup

The React app should automatically open in your default browser. If not, you can access it at:
```
http://localhost:3000
```

The backend API is available at:
```
http://localhost:5001
```

## Available Pages

- Dashboard (Home): `http://localhost:3000/`
- Schedule Management: `http://localhost:3000/schedule`
- Medication Management: `http://localhost:3000/medications`
- Health Tracking: `http://localhost:3000/health`

## API Endpoints

- Users: `http://localhost:5001/api/users`
- Care Recipients: `http://localhost:5001/api/care-recipients`
- Health Events: `http://localhost:5001/api/health-events`
- Medications: `http://localhost:5001/api/medications`
- Visits: `http://localhost:5001/api/visits`

## Notes

This is a mockup with mock data - no database or authentication is implemented. All data is stored in-memory and will reset when the server restarts.