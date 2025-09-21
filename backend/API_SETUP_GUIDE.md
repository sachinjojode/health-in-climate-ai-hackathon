# 🔑 API Credentials Setup Guide

This guide will help you get the required API credentials for the Health Notifier backend.

## 📋 Required APIs

You need to get API keys for these services:

1. **Google Gemini AI** (for health risk assessment)
2. **OpenWeatherMap** (for weather data)

---

## 🤖 Google Gemini AI API

### Step 1: Create Google Account
- Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
- Sign in with your Google account

### Step 2: Create API Key
1. Click "Create API Key"
2. Choose "Create API key in new project" or select existing project
3. Copy the generated API key
4. **Important**: Keep this key secure and don't share it publicly

### Step 3: Add to Environment
Add your Gemini API key to the `.env` file:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

---

## 🌤️ OpenWeatherMap API

### Step 1: Create Account
- Go to [OpenWeatherMap](https://openweathermap.org/api)
- Click "Sign Up" to create a free account
- Verify your email address

### Step 2: Get API Key
1. After login, go to [API Keys](https://home.openweathermap.org/api_keys)
2. You'll see a default API key (may take a few minutes to activate)
3. Copy the API key

### Step 3: Add to Environment
Add your weather API key to the `.env` file:
```env
WEATHER_API_KEY=your_actual_weather_api_key_here
```

---

## 🗄️ Database Setup

### Option 1: SQLite (Easiest - Recommended for Development)
No additional setup needed. The backend will create a SQLite database automatically.

### Option 2: MySQL (For Production)
1. Install MySQL on your system
2. Create a database called `health_notifier`
3. Update the `.env` file:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=health_notifier
```

---

## 🔧 Complete .env File Example

Here's what your complete `.env` file should look like:

```env
# Database Configuration (SQLite - no setup needed)
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=health_notifier

# External APIs
GEMINI_API_KEY=your_gemini_api_key_here
WEATHER_API_KEY=your_weather_api_key_here

# App Settings
FLASK_ENV=development
SECRET_KEY=your_secret_key_here_make_it_random
FLASK_DEBUG=True
```

---

## 🚀 Testing Your Setup

After setting up your API keys:

1. **Start the backend**:
   ```bash
   cd backend
   python main.py
   ```

2. **Test the health endpoint**:
   ```bash
   curl http://localhost:5000/api/health
   ```

3. **Test weather API** (replace with your ZIP code):
   ```bash
   curl http://localhost:5000/api/weather/90210
   ```

---

## ❗ Important Security Notes

- **Never commit your `.env` file** to version control
- **Keep your API keys private** and don't share them
- **Use different keys** for development and production
- **Monitor your API usage** to avoid unexpected charges

---

## 🆘 Troubleshooting

### Common Issues:

1. **"Invalid API Key" Error**
   - Double-check you copied the API key correctly
   - Make sure there are no extra spaces or characters
   - Verify the API key is active (some take time to activate)

2. **"Database Connection Failed"**
   - For SQLite: Make sure the `backend/data/` directory exists
   - For MySQL: Verify your database credentials and that MySQL is running

3. **"Module Not Found" Errors**
   - Run `python setup.py` to install dependencies
   - Make sure you're in the `backend` directory

### Getting Help:
- Check the backend logs for detailed error messages
- Make sure all API keys are properly formatted in `.env`
- Verify your internet connection for API calls

---

## 🎯 Quick Start Commands

```bash
# 1. Setup backend
cd backend
python setup.py

# 2. Edit .env with your API keys
nano .env  # or use your preferred editor

# 3. Start backend
python main.py

# 4. In another terminal, start frontend
cd ..
npm run dev
```

Your Health Notifier will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
