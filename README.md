# Health Notifier

A complete full-stack health notification system with React frontend and Flask backend. Features a Gmail-style inbox interface with real-time health risk monitoring and emergency notifications.

## 🚀 Quick Start (Full Stack)

### Option 1: One-Click Start (Recommended)
```bash
# Linux/Mac
./start.sh

# Windows
start.bat
```

### Option 2: Manual Start
```bash
# Terminal 1: Start Backend
cd backend
python setup.py  # First time only
python main.py

# Terminal 2: Start Frontend  
npm install      # First time only
npm run dev
```

**Access your app:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📋 Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- API Keys (see setup guide below)

## 🔧 First Time Setup

### 1. Get API Keys
You'll need API keys for the backend to work:

- **Google Gemini AI**: https://makersuite.google.com/app/apikey (for health risk assessment)
- **OpenWeatherMap**: https://openweathermap.org/api (for weather data)

### 2. Configure Backend
```bash
cd backend
python setup.py
```

Edit `backend/.env` with your API keys:
```env
GEMINI_API_KEY=your_gemini_key_here
WEATHER_API_KEY=your_weather_key_here
```

### 3. Start the Application
Use the quick start commands above, or see `BACKEND_INTEGRATION_GUIDE.md` for detailed instructions.

## 📁 Project Structure

```
health-in-climate-ai-hackathon/
├── src/                    # React frontend
│   ├── components/        # UI components  
│   ├── data/             # API adapter
│   └── ...
├── backend/               # Flask backend
│   ├── app/              # Flask application
│   ├── setup.py          # Easy setup script
│   └── API_SETUP_GUIDE.md # API credentials guide
├── start.sh              # One-click start (Linux/Mac)
├── start.bat             # One-click start (Windows)
└── BACKEND_INTEGRATION_GUIDE.md # Complete setup guide
```

## 🎯 Features

### Frontend Features
- **Modern React UI** with TypeScript and Tailwind CSS
- **Gmail-style Interface** with resizable reading panel
- **Real-time Notifications** with risk level indicators
- **Responsive Design** for mobile and desktop
- **Accessibility** with keyboard navigation and screen reader support

### Backend Features  
- **Flask REST API** with comprehensive health monitoring
- **AI-powered Risk Assessment** using Google Gemini
- **Weather Integration** for environmental health factors
- **Database Management** with SQLAlchemy
- **Emergency Notification System** for high-risk patients

## 🔌 API Integration

The frontend automatically connects to the backend APIs:

- **GET** `/api/notifications/{patient_id}` - Fetch notifications
- **POST** `/api/notifications/mark-read/{id}` - Mark as read
- **GET** `/api/patients/{id}` - Get patient data
- **GET** `/api/weather/{zip_code}` - Weather data
- **POST** `/api/assess-risk/{id}` - Risk assessment

## 📊 Sample Data

The system includes sample data for testing:

- **Sample Patients** with different risk profiles
- **Test Notifications** with various risk levels
- **Weather Data** for different locations
- **Emergency Scenarios** for high-risk situations

## 🚨 Troubleshooting

### Common Issues

1. **Backend won't start**: Check API keys in `backend/.env`
2. **Frontend shows no data**: Ensure backend is running on port 5000
3. **API errors**: Verify API keys are correct and active

### Getting Help

- **Setup Issues**: See `BACKEND_INTEGRATION_GUIDE.md`
- **API Setup**: See `backend/API_SETUP_GUIDE.md`
- **Frontend Issues**: Check browser console for errors

## 📚 Documentation

- **Complete Setup Guide**: `BACKEND_INTEGRATION_GUIDE.md`
- **API Credentials**: `backend/API_SETUP_GUIDE.md`
- **Backend Documentation**: `backend/docs/`
- **Architecture Overview**: `backend/docs/ARCHITECTURE.md`

## 🚀 Development

### Frontend Development

```
src/
├── components/           # Reusable UI components
│   ├── InboxList.tsx    # Message list with filtering
│   ├── InboxToolbar.tsx # Filter buttons and actions
│   ├── MessageRow.tsx   # Individual message row
│   ├── RightPanel.tsx   # Gmail-style reading panel
│   ├── Toast.tsx        # Toast notification system
│   └── TopWidgets.tsx   # Top dashboard widgets
├── data/
│   └── adapter.ts       # Data layer (API integration point)
├── pages/
│   └── Home.tsx         # Main application page
├── styles/
│   └── globals.css      # Global styles and Tailwind setup
├── types.ts             # TypeScript type definitions
├── App.tsx              # Main app component with routing
└── main.tsx             # Application entry point
```

## 🎯 Features

### Core Interface
- **Top Widgets**: Three placeholder cards for future charts/dashboards
- **Inbox**: Message list with filtering and search capabilities
- **Reading Panel**: Gmail-style slide-out panel for message reading

### Message Management
- **Risk Levels**: Low (green), Medium (amber), High (red) indicators
- **Filtering**: All, Unread, Low, Medium, High risk filters
- **Actions**: Mark as read/unread, request call, view full message

### Reading Panel Features
- **Resizable**: Drag the left edge to resize (360px minimum)
- **Responsive**: Full-screen on mobile, docked on desktop
- **Keyboard Support**: ESC key to close
- **Persistent**: Stays open when clicking other messages

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and roles
- **Focus Management**: Visible focus indicators
- **High Contrast**: Accessible color schemes

## 🔌 API Integration

### Data Adapter (`src/data/adapter.ts`)

The app uses a data adapter pattern for clean separation between UI and data sources. Replace the TODO comments with actual API calls:

```typescript
// Current stubbed functions:
export async function listMessages(): Promise<Message[]>
export async function getMessage(id: string): Promise<Message | null>
export async function markRead(id: string): Promise<void>
export async function requestCall(messageId: string): Promise<void>
```

### Integration Examples

**Fetch all messages:**
```typescript
// Replace in listMessages()
const response = await fetch('/api/messages');
return response.json();
```

**Mark message as read:**
```typescript
// Replace in markRead()
await fetch(`/api/messages/${id}/read`, { method: 'PUT' });
```

**Request call:**
```typescript
// Replace in requestCall()
await fetch('/api/calls/request', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ messageId })
});
```

## 🎨 UI Components

### MessageRow
- Risk indicator dot (color-coded)
- Patient name and subject
- Preview text with truncation
- Timestamp with relative formatting
- Action menu (⋯) with contextual options

### InboxToolbar
- Filter buttons (All, Unread, Low, Medium, High)
- Refresh button
- Development-only "Load Sample Data" button

### RightPanel
- Slide-in animation from right
- Resizable width (desktop only)
- Message header with actions
- Scrollable message body
- Mobile-responsive (full screen)

### Toast System
- Auto-dismissing notifications
- Success, error, and info variants
- Accessible with proper ARIA attributes

## 🔧 Development Features

### Sample Data
A "Load Sample Data" button is available in the toolbar for development/testing. This populates the inbox with 3 sample messages demonstrating different risk levels.

**To enable sample data:**
1. The button is visible by default in development
2. Click "Load Sample Data" in the toolbar
3. Sample messages will appear in the inbox

**To disable sample data:**
Remove the `onLoadSampleData={handleLoadSampleData}` prop from `InboxToolbar` in `Home.tsx`

### Type Definitions

```typescript
type HeatRisk = 'low' | 'medium' | 'high'

interface Message {
  id: string
  patientName: string
  risk: HeatRisk
  subject: string
  preview: string
  body: string
  createdAt: string
  read: boolean
}
```

## 🎛️ State Management

The app uses React's built-in state management with Context for the toast system. No external state libraries are used.

**Main state in Home.tsx:**
- `messages`: Array of all messages
- `filter`: Current filter type
- `selectedMessage`: Currently open message in panel
- `loading`: Loading state for async operations

## 📱 Responsive Design

### Desktop (sm and up)
- Three-column widget layout
- Resizable reading panel
- Hover states and interactions

### Mobile (below sm)
- Single-column widget layout
- Full-screen reading panel
- Touch-optimized interactions

## 🎨 Styling

### Tailwind CSS
- Utility-first CSS framework
- Custom color palette for risk levels
- Responsive design utilities
- Focus states for accessibility

### Custom Classes
- `.risk-dot`: Colored indicator dots
- `.risk-pill`: Styled risk level badges
- `.focus-ring`: Consistent focus indicators
- `.custom-scrollbar`: Styled scrollbars

## 🧪 Testing the UI

### Empty States
- Start with no data to see empty state messaging
- Test different filters with no matching messages

### Sample Data
- Click "Load Sample Data" to populate with test messages
- Test all filtering options
- Try all message actions

### Panel Interactions
- Click message rows to open panel
- Resize panel by dragging left edge
- Close with X button or ESC key
- Test on mobile (full-screen panel)

## 🚀 Deployment

### Build Process
```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Environment Variables
No environment variables are required for the frontend. API endpoints should be configured in the data adapter.

## 📋 Browser Support

- Chrome 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## 🤝 Contributing

1. Follow TypeScript best practices
2. Use Tailwind utility classes
3. Maintain accessibility standards
4. Test responsive behavior
5. Update types when adding new features

## 📄 License

This project is created for the Health in Climate AI Hackathon.
