# 🚀 Health Notifier - Backend Integration Guide

This guide will help you integrate the Flask backend with your React frontend to create a complete health notification system.

## 📁 Project Structure

```
health-in-climate-ai-hackathon/
├── src/                    # React frontend
│   ├── components/        # UI components
│   ├── data/             # API adapter (connects to backend)
│   └── ...
├── backend/               # Flask backend
│   ├── app/              # Flask application
│   ├── main.py           # Backend entry point
│   ├── setup.py          # Easy setup script
│   └── API_SETUP_GUIDE.md # API credentials guide
└── README.md             # Frontend documentation
```

---

## 🎯 Quick Start (5 Minutes)

### Step 1: Setup Backend
```bash
cd backend
python setup.py
```

### Step 2: Get API Keys
Follow the guide in `backend/API_SETUP_GUIDE.md` to get:
- Google Gemini AI API key
- OpenWeatherMap API key

### Step 3: Configure Environment
Edit `backend/.env` with your API keys:
```env
GEMINI_API_KEY=your_gemini_key_here
WEATHER_API_KEY=your_weather_key_here
```

### Step 4: Start Backend
```bash
cd backend
python main.py
```
Backend will be available at: http://localhost:5000

### Step 5: Start Frontend
```bash
npm run dev
```
Frontend will be available at: http://localhost:3000

---

## 🔧 Detailed Setup Instructions

### Prerequisites
- Python 3.8+ installed
- Node.js 18+ installed
- Internet connection for API calls

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Run the setup script**:
   ```bash
   python setup.py
   ```
   This will:
   - Check Python installation
   - Install all dependencies
   - Create `.env` file from template
   - Set up database directories

3. **Get API credentials** (see `backend/API_SETUP_GUIDE.md`):
   - **Google Gemini AI**: https://makersuite.google.com/app/apikey
   - **OpenWeatherMap**: https://openweathermap.org/api

4. **Edit `.env` file** with your credentials:
   ```env
   GEMINI_API_KEY=your_actual_gemini_key
   WEATHER_API_KEY=your_actual_weather_key
   SECRET_KEY=your_random_secret_key_here
   ```

5. **Initialize database**:
   ```bash
   python main.py
   ```
   This will create the database tables and start the server.

### Frontend Setup

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

---

## 🌐 API Integration

The frontend is already configured to connect to the backend APIs:

### Available Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/notifications/{patient_id}` | GET | Get notifications |
| `/api/notifications/mark-read/{id}` | POST | Mark as read |
| `/api/patients` | POST | Create patient |
| `/api/patients/{id}` | GET | Get patient |
| `/api/weather/{zip_code}` | GET | Get weather data |

### Data Flow

1. **Frontend** calls `listMessages()` in `src/data/adapter.ts`
2. **Adapter** makes HTTP request to `http://localhost:5000/api/notifications/1`
3. **Backend** queries database and returns notifications
4. **Frontend** displays notifications in the UI

---

## 🗄️ Database

### SQLite (Default - Easiest)
- Database file: `backend/data/health_notifier.db`
- No additional setup required
- Perfect for development and small deployments

### MySQL (Production)
1. Install MySQL
2. Create database: `health_notifier`
3. Update `.env`:
   ```env
   DB_HOST=localhost
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=health_notifier
   ```

---

## 🧪 Testing the Integration

### Test Backend
```bash
# Health check
curl http://localhost:5000/api/health

# Weather data
curl http://localhost:5000/api/weather/90210
```

### Test Frontend
1. Open http://localhost:3000
2. Click "Load Sample Data" to see test notifications
3. Try filtering by risk level
4. Click on notifications to open reading panel
5. Test "Mark as Read" functionality

---

## 📊 Sample Data

The backend includes sample data generation. To add sample patients and notifications:

1. **Create a patient**:
   ```bash
   curl -X POST http://localhost:5000/api/patients \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Jane Doe",
       "age": 28,
       "zip_code": "90210",
       "weeks_pregnant": 24
     }'
   ```

2. **View notifications**:
   ```bash
   curl http://localhost:5000/api/notifications/1
   ```

---

## 🚨 Troubleshooting

### Backend Issues

1. **"Module not found" errors**:
   ```bash
   cd backend
   python setup.py
   ```

2. **"Database connection failed"**:
   - Check `.env` file configuration
   - Ensure database directory exists: `backend/data/`

3. **"Invalid API key" errors**:
   - Verify API keys in `.env` file
   - Check API key is active (some take time to activate)

### Frontend Issues

1. **"Failed to fetch messages"**:
   - Ensure backend is running on port 5000
   - Check browser console for CORS errors
   - Verify API endpoints are accessible

2. **Empty notification list**:
   - Backend might not have sample data
   - Create a patient first to generate notifications

### Common Solutions

1. **Restart both servers**:
   ```bash
   # Terminal 1: Backend
   cd backend && python main.py
   
   # Terminal 2: Frontend
   npm run dev
   ```

2. **Check ports**:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

3. **Clear browser cache** and hard refresh (Ctrl+F5)

---

## 🔄 Development Workflow

### Making Changes

1. **Backend changes**:
   - Edit files in `backend/app/`
   - Restart backend server
   - Test with curl or frontend

2. **Frontend changes**:
   - Edit files in `src/`
   - Frontend auto-reloads
   - Test in browser

3. **API changes**:
   - Update backend endpoints
   - Update frontend adapter in `src/data/adapter.ts`
   - Test integration

### Adding New Features

1. **New API endpoint**:
   - Add route in `backend/app/api/`
   - Update frontend adapter
   - Test with frontend

2. **New UI component**:
   - Create component in `src/components/`
   - Import and use in pages
   - Style with Tailwind CSS

---

## 🚀 Deployment

### Development
- Use SQLite database
- Run on localhost
- Enable debug mode

### Production
- Use MySQL database
- Set up proper environment variables
- Use production WSGI server (Gunicorn)
- Set up reverse proxy (Nginx)

See `backend/deployment/` directory for detailed deployment guides.

---

## 📚 Additional Resources

- **Backend API Documentation**: `backend/docs/`
- **API Setup Guide**: `backend/API_SETUP_GUIDE.md`
- **Frontend Documentation**: `README.md`
- **Architecture Overview**: `backend/docs/ARCHITECTURE.md`

---

## 🎉 You're Ready!

Your Health Notifier system is now fully integrated with:
- ✅ React frontend with modern UI
- ✅ Flask backend with real APIs
- ✅ Database with sample data
- ✅ Weather and AI integration
- ✅ Complete notification system

Start the servers and begin using your health notification system!
