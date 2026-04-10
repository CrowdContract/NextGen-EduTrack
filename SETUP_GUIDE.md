# 🚀 Complete Setup Guide - NextGen EduTrack

This guide will walk you through setting up NextGen EduTrack from scratch, even if you're new to web development.

## 📑 Table of Contents
1. [Prerequisites Installation](#prerequisites-installation)
2. [Project Setup](#project-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Running the Application](#running-the-application)
6. [Testing the Setup](#testing-the-setup)
7. [Common Issues](#common-issues)

---

## 1. Prerequisites Installation

### Step 1.1: Install Node.js

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the **LTS version** (recommended)
3. Run the installer
4. Verify installation:
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers (e.g., v18.x.x or higher)

### Step 1.2: Install MongoDB

#### Windows:
1. Visit [MongoDB Download Center](https://www.mongodb.com/try/download/community)
2. Download MongoDB Community Server
3. Run the installer
4. Choose "Complete" installation
5. Install MongoDB as a Service (check the box)
6. Install MongoDB Compass (optional but recommended for GUI)

#### macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian):
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Create list file
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Verify MongoDB Installation:
```bash
mongod --version
```

### Step 1.3: Install Git

1. Visit [git-scm.com](https://git-scm.com/)
2. Download and install Git
3. Verify installation:
   ```bash
   git --version
   ```

---

## 2. Project Setup

### Step 2.1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/CrowdContract/NextGen-EduTrack.git

# Navigate to project directory
cd NextGen-EduTrack
```

### Step 2.2: Install All Dependencies

**Quick Method (Recommended):**
```bash
npm run install:all
```

**Manual Method:**
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..

# Install server dependencies
cd server
npm install
cd ..
```

This may take 5-10 minutes depending on your internet speed.

---

## 3. Environment Configuration

### Step 3.1: Create Environment File

Navigate to the `server` directory and create a `.env` file:

```bash
cd server
```

Create a file named `.env` (you can copy from `.env.example`):

```bash
# Windows
copy .env.example .env

# macOS/Linux
cp .env.example .env
```

### Step 3.2: Configure Environment Variables

Open the `.env` file and update the following:

```env
# Server Configuration
PORT=4000
FRONTEND_URL=http://localhost:5173

# Database Configuration
MONGO_URI=mongodb://127.0.0.1:27017/nextgen_edutrack

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

# Email Configuration (Gmail Example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_gmail_app_password
SMTP_SERVICE=gmail

# AI Configuration (Groq)
GROQ_TOKEN=your_groq_api_token_here

# Cloud Storage (Optional - for production)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Step 3.3: Get Required API Keys

#### Gmail App Password (for Email Features):

1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security → 2-Step Verification → App passwords
4. Generate a new app password
5. Copy the 16-character password
6. Paste it in `SMTP_PASSWORD` in your `.env` file

#### Groq API Token (for AI Features):

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key
6. Paste it in `GROQ_TOKEN` in your `.env` file

#### Cloudinary (Optional - for Production):

1. Visit [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Get your credentials from the dashboard
4. Add them to your `.env` file

---

## 4. Database Setup

### Step 4.1: Start MongoDB

#### Windows:
MongoDB should start automatically if installed as a service. If not:
```bash
# Start MongoDB service
net start MongoDB
```

#### macOS:
```bash
brew services start mongodb-community
```

#### Linux:
```bash
sudo systemctl start mongod
```

### Step 4.2: Verify MongoDB is Running

```bash
# Check if MongoDB is running
mongosh
```

If you see a MongoDB shell prompt, it's working! Type `exit` to quit.

### Step 4.3: Create Database (Optional)

The application will automatically create the database on first run, but you can create it manually:

```bash
mongosh
use nextgen_edutrack
exit
```

---

## 5. Running the Application

### Step 5.1: Start Both Servers (Easiest)

From the root directory:

```bash
npm run dev:all
```

This will start:
- Backend server on `http://localhost:4000`
- Frontend server on `http://localhost:5173`

### Step 5.2: Alternative - Run Servers Separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

### Step 5.3: Wait for Servers to Start

You should see messages like:
```
Backend: Server running on port 4000
Backend: MongoDB connected successfully
Frontend: Local: http://localhost:5173/
```

---

## 6. Testing the Setup

### Step 6.1: Test Backend

Open your browser and visit:
```
http://localhost:4000/test
```

You should see a JSON response like:
```json
{
  "success": true,
  "message": "API is working"
}
```

### Step 6.2: Test Frontend

Open your browser and visit:
```
http://localhost:5173
```

You should see the NextGen EduTrack login page.

### Step 6.3: Create First Admin User

1. Click on "Register" or "Sign Up"
2. Fill in the registration form
3. Select role as "Admin"
4. Submit the form
5. Check your email for verification (if email is configured)

### Step 6.4: Test Login

1. Use your credentials to log in
2. You should be redirected to the dashboard

---

## 7. Common Issues

### Issue 1: Port Already in Use

**Error:** `Port 4000 is already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :4000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:4000 | xargs kill -9

# Or use npx
npx kill-port 4000
```

### Issue 2: MongoDB Connection Failed

**Error:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solutions:**
1. Check if MongoDB is running:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS
   brew services start mongodb-community
   
   # Linux
   sudo systemctl start mongod
   ```

2. Verify `MONGO_URI` in `.env` file
3. Try using `127.0.0.1` instead of `localhost`

### Issue 3: Module Not Found

**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Do the same for client and server
cd client
rm -rf node_modules package-lock.json
npm install
cd ..

cd server
rm -rf node_modules package-lock.json
npm install
cd ..
```

### Issue 4: CORS Error

**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
1. Check `FRONTEND_URL` in server `.env` file
2. Ensure it matches your frontend URL exactly
3. Restart the backend server

### Issue 5: Email Not Sending

**Error:** `Invalid login: 535-5.7.8 Username and Password not accepted`

**Solutions:**
1. Use Gmail App Password, not your regular password
2. Enable 2-Factor Authentication on your Google account
3. Generate a new App Password
4. Verify SMTP settings in `.env`

### Issue 6: AI Features Not Working

**Error:** `Groq API error` or `Invalid API key`

**Solutions:**
1. Verify your `GROQ_TOKEN` in `.env`
2. Check if you have API credits remaining
3. Visit [console.groq.com](https://console.groq.com) to check status
4. Generate a new API key if needed

### Issue 7: Build Errors

**Error:** Various build errors

**Solutions:**
```bash
# Clear cache and rebuild
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# For client
cd client
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🎉 Success!

If you've followed all steps and can access both the frontend and backend, congratulations! Your NextGen EduTrack setup is complete.

### Next Steps:

1. **Explore the Application:**
   - Create test users (students, teachers, admins)
   - Upload sample projects
   - Test AI features

2. **Customize:**
   - Update branding in `client/src/assets/`
   - Modify theme colors in `client/tailwind.config.js`
   - Add custom features

3. **Deploy:**
   - Follow the deployment guide in README.md
   - Set up production environment variables
   - Configure domain and SSL

### Need Help?

- 📖 Check the main [README.md](README.md)
- 🐛 Report issues on [GitHub Issues](https://github.com/CrowdContract/NextGen-EduTrack/issues)
- 💬 Join our community discussions
- 📧 Contact: support@nextgen-edutrack.com

---

**Happy Coding! 🚀**
