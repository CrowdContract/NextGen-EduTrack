# ⚡ Quick Start - NextGen EduTrack

Get up and running in 5 minutes!

## 🚀 Super Quick Setup

```bash
# 1. Clone
git clone https://github.com/CrowdContract/NextGen-EduTrack.git
cd NextGen-EduTrack

# 2. Install everything
npm run install:all

# 3. Setup environment
cd server
cp .env.example .env
# Edit .env with your credentials
cd ..

# 4. Start MongoDB
mongod

# 5. Run the app
npm run dev:all
```

## 🌐 Access

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## 📝 Minimum Required Config

Edit `server/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/nextgen_edutrack
JWT_SECRET=your_secret_key_here
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
GROQ_TOKEN=your_groq_token_here
```

## 🔑 Get API Keys

1. **Gmail App Password**: Google Account → Security → 2-Step Verification → App passwords
2. **Groq Token**: [console.groq.com](https://console.groq.com) → API Keys

## 📚 Full Documentation

- [Complete Setup Guide](SETUP_GUIDE.md) - Detailed step-by-step instructions
- [README](README.md) - Full project documentation

## 🆘 Quick Fixes

**Port in use?**
```bash
npx kill-port 4000 5173
```

**MongoDB not running?**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Need help?** Check [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed troubleshooting.
