#!/usr/bin/env python3
"""
Health Notifier Backend Setup Script
This script helps you set up the backend with all required dependencies and configurations.
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

def print_header():
    """Print setup header"""
    print("🏥 Health Notifier Backend Setup")
    print("=" * 50)
    print()

def check_python():
    """Check if Python 3.8+ is installed"""
    print("🐍 Checking Python installation...")
    try:
        version = sys.version_info
        if version.major == 3 and version.minor >= 8:
            print(f"✅ Python {version.major}.{version.minor}.{version.micro} is installed")
            return True
        else:
            print(f"❌ Python {version.major}.{version.minor}.{version.micro} is too old")
            print("   Please install Python 3.8 or newer")
            return False
    except Exception as e:
        print(f"❌ Error checking Python: {e}")
        return False

def install_requirements():
    """Install Python requirements"""
    print("\n📦 Installing Python dependencies...")
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"], 
                      check=True, capture_output=True, text=True)
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing dependencies: {e}")
        print(f"   Error output: {e.stderr}")
        return False

def setup_environment():
    """Set up environment file"""
    print("\n🔧 Setting up environment configuration...")
    
    env_file = Path(".env")
    env_example = Path(".env.example")
    
    if env_file.exists():
        print("✅ .env file already exists")
        return True
    
    if not env_example.exists():
        print("❌ .env.example file not found")
        return False
    
    # Copy example to .env
    shutil.copy(env_example, env_file)
    print("✅ Created .env file from template")
    print("⚠️  Please edit .env file with your actual API credentials")
    
    return True

def create_database_dirs():
    """Create necessary database directories"""
    print("\n🗄️  Setting up database directories...")
    
    # Create data directory for SQLite (if using SQLite)
    data_dir = Path("data")
    data_dir.mkdir(exist_ok=True)
    print("✅ Created data directory")
    
    return True

def show_next_steps():
    """Show next steps to the user"""
    print("\n🎉 Backend setup completed!")
    print("\n📋 Next steps:")
    print("1. Edit .env file with your API credentials:")
    print("   - GEMINI_API_KEY: Get from https://makersuite.google.com/app/apikey")
    print("   - WEATHER_API_KEY: Get from https://openweathermap.org/api")
    print("   - DB_* settings: Configure your database")
    print()
    print("2. Initialize the database:")
    print("   python main.py")
    print()
    print("3. Start the backend server:")
    print("   python main.py")
    print()
    print("4. Test the API:")
    print("   curl http://localhost:5000/api/health")
    print()
    print("5. The backend will be available at: http://localhost:5000")

def main():
    """Main setup function"""
    print_header()
    
    # Check Python
    if not check_python():
        sys.exit(1)
    
    # Install requirements
    if not install_requirements():
        print("\n❌ Setup failed at dependency installation")
        sys.exit(1)
    
    # Setup environment
    if not setup_environment():
        print("\n❌ Setup failed at environment setup")
        sys.exit(1)
    
    # Create directories
    if not create_database_dirs():
        print("\n❌ Setup failed at directory creation")
        sys.exit(1)
    
    # Show next steps
    show_next_steps()

if __name__ == "__main__":
    main()
