# 🎓 NextGen EduTrack

A comprehensive Final Year Project (FYP) Management System designed to streamline the supervision, submission, and evaluation process for university projects. Built with modern web technologies to provide an intuitive experience for students, teachers, and administrators.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![React](https://img.shields.io/badge/react-19.1.1-61dafb.svg)

## ✨ Features

### 👨‍🎓 For Students
- **Project Proposal Submission** - Submit and manage project proposals
- **Supervisor Request System** - Request and connect with supervisors
- **File Upload & Management** - Upload project files, documentation, and code
- **AI Assistant** - Get intelligent help with project-related queries
- **Code Explainer** - AI-powered code explanation and analysis
- **Real-time Notifications** - Stay updated on project status and feedback
- **Feedback Tracking** - View and respond to supervisor feedback

### 👨‍🏫 For Teachers
- **Student Management** - View and manage assigned students
- **Request Handling** - Accept or reject supervisor requests
- **AI-Powered Grading** - Automated grading assistance with AI
- **File Review** - Access and review student submissions
- **Feedback System** - Provide detailed feedback to students
- **Dashboard Analytics** - Track student progress and performance

### 👨‍💼 For Administrators
- **User Management** - Add, edit, and manage students and teachers
- **Supervisor Assignment** - Assign supervisors to students
- **Project Oversight** - Monitor all ongoing projects
- **Deadline Management** - Set and track project deadlines
- **System Analytics** - Comprehensive dashboard with insights
- **Bulk Operations** - Efficient management of multiple users

### 🤖 AI-Powered Features
- **Smart Search** - Natural language project search
- **Code Analysis** - Intelligent code review and suggestions
- **Automated Grading** - AI-assisted project evaluation
- **Chat Assistant** - Context-aware help for students and teachers

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Redux Toolkit** - State management
- **React Router** - Navigation
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **Lucide React** - Icon library

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Multer** - File uploads
- **Cloudinary** - Cloud storage

### AI Integration
- **Groq SDK** - AI model integration
- **PDF Parse** - Document processing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** (comes with Node.js)
- **Git** - [Download](https://git-scm.com/)

### Quick Prerequisites Check
```bash
# Check Node.js version
node --version  # Should be v18 or higher

# Check npm version
npm --version

# Check MongoDB installation
mongod --version

# Check Git installation
git --version
```

## ✅ Setup Checklist

Follow this checklist to ensure proper setup:

- [ ] Node.js v18+ installed
- [ ] MongoDB installed and running
- [ ] Git installed
- [ ] Repository cloned
- [ ] Root dependencies installed (`npm install`)
- [ ] Client dependencies installed (`cd client && npm install`)
- [ ] Server dependencies installed (`cd server && npm install`)
- [ ] `.env` file created in `server/` directory
- [ ] All environment variables configured
- [ ] MongoDB connection string updated
- [ ] SMTP credentials configured (for email)
- [ ] Groq API token added (for AI features)
- [ ] MongoDB service started
- [ ] Backend server running (port 4000)
- [ ] Frontend server running (port 5173)
- [ ] Can access http://localhost:5173
- [ ] Can access http://localhost:4000/test

## 🚀 Quick Start Guide

### 1. Clone the Repository
```bash
git clone https://github.com/CrowdContract/NextGen-EduTrack.git
cd NextGen-EduTrack
```

### 2. Install Dependencies

#### Quick Install (All at Once)
```bash
npm run install:all
```

This will install dependencies for root, client, and server in one command.

#### Manual Install (Step by Step)
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

### 3. Environment Configuration

Create a `.env` file in the `server` directory:

```env
# Server Configuration
PORT=4000
FRONTEND_URL=http://localhost:5173

# Database
MONGO_URI=mongodb://127.0.0.1:27017/nextgen_edutrack

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
COOKIE_EXPIRE=7

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_SERVICE=gmail

# AI Configuration
GROQ_TOKEN=your_groq_api_token_here

# Cloud Storage (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 4. Database Setup

Ensure MongoDB is running:
```bash
# Start MongoDB service
mongod
```

The application will automatically create the database and collections on first run.

### 5. Run the Application

#### Development Mode (Easiest Way)

**Run Both Servers with One Command:**
```bash
npm run dev:all
```
This starts both frontend (port 5173) and backend (port 4000) simultaneously.

#### Alternative: Run Servers Separately

**Backend Only:**
```bash
npm run server
# or
cd server
npm run dev
```

**Frontend Only:**
```bash
npm run client
# or
cd client
npm run dev
```

#### Production Mode

**Build Frontend:**
```bash
npm run build
```

**Start Backend:**
```bash
npm start
```

### 6. Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:4000
- **API Test:** http://localhost:4000/test

## 📁 Project Structure

```
NextGen-EduTrack/
├── client/                     # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── layout/         # Layout components (Navbar, Sidebar, etc.)
│   │   │   └── modal/          # Modal components
│   │   ├── pages/              # Page components
│   │   │   ├── admin/          # Admin pages
│   │   │   ├── student/        # Student pages
│   │   │   ├── teacher/        # Teacher pages
│   │   │   └── auth/           # Authentication pages
│   │   ├── store/              # Redux store & slices
│   │   │   └── slices/         # Redux slices
│   │   ├── context/            # React context providers
│   │   ├── lib/                # Utilities & configurations
│   │   └── assets/             # Images & static files
│   ├── public/                 # Public assets
│   ├── index.html              # HTML entry point
│   ├── vite.config.js          # Vite configuration
│   ├── tailwind.config.js      # Tailwind CSS config
│   └── package.json            # Client dependencies
│
├── server/                     # Express backend application
│   ├── config/                 # Configuration files
│   │   └── db.js               # Database connection
│   ├── controllers/            # Route controllers
│   │   ├── authController.js   # Authentication logic
│   │   ├── adminController.js  # Admin operations
│   │   ├── studentController.js
│   │   ├── teacherController.js
│   │   └── aiController.js     # AI features
│   ├── models/                 # Mongoose models
│   │   ├── user.js             # User model
│   │   ├── project.js          # Project model
│   │   ├── deadline.js         # Deadline model
│   │   └── notification.js     # Notification model
│   ├── router/                 # API routes
│   │   ├── userRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── studentRoutes.js
│   │   ├── teacherRoutes.js
│   │   └── aiRoutes.js
│   ├── middlewares/            # Custom middlewares
│   │   ├── authMiddleware.js   # JWT authentication
│   │   ├── error.js            # Error handling
│   │   └── upload.js           # File upload handling
│   ├── services/               # Business logic services
│   │   ├── aiService.js        # AI integration
│   │   ├── emailService.js     # Email functionality
│   │   └── fileService.js      # File operations
│   ├── utils/                  # Helper functions
│   │   ├── generateToken.js    # JWT token generation
│   │   └── sendEmail.js        # Email utilities
│   ├── uploads/                # Uploaded files storage
│   ├── temp/                   # Temporary files
│   ├── .env                    # Environment variables (create this)
│   ├── .env.example            # Environment template
│   ├── app.js                  # Express app setup
│   ├── server.js               # Server entry point
│   └── package.json            # Server dependencies
│
├── .gitignore                  # Git ignore rules
├── package.json                # Root package (scripts)
└── README.md                   # This file
```

## 🔐 Default Credentials

After initial setup, you can create admin credentials through the database or use the registration flow.

**Note:** Change default credentials immediately in production!

## 📡 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/forgot-password` - Password reset request
- `POST /api/v1/auth/reset-password/:token` - Reset password

### Admin
- `GET /api/v1/admin/dashboard` - Dashboard stats
- `GET /api/v1/admin/students` - Get all students
- `POST /api/v1/admin/student` - Add student
- `PUT /api/v1/admin/student/:id` - Update student
- `DELETE /api/v1/admin/student/:id` - Delete student
- `GET /api/v1/admin/teachers` - Get all teachers
- `POST /api/v1/admin/teacher` - Add teacher

### Student
- `POST /api/v1/student/proposal` - Submit proposal
- `GET /api/v1/student/supervisor` - Get supervisor info
- `POST /api/v1/student/request` - Request supervisor
- `POST /api/v1/student/upload` - Upload files

### Teacher
- `GET /api/v1/teacher/students` - Get assigned students
- `GET /api/v1/teacher/requests` - Get pending requests
- `PUT /api/v1/teacher/request/:id/accept` - Accept request
- `PUT /api/v1/teacher/request/:id/reject` - Reject request

### AI
- `POST /api/v1/ai/search` - Smart project search
- `POST /api/v1/ai/chat` - AI assistant chat
- `POST /api/v1/ai/explain-code` - Code explanation
- `POST /api/v1/ai/grade` - AI-assisted grading

## 🎨 Features in Detail

### Dark Mode Support
The application includes a fully functional dark mode with smooth transitions and persistent theme preferences.

### Responsive Design
Optimized for all screen sizes - desktop, tablet, and mobile devices.

### Real-time Updates
WebSocket-based notifications keep users informed of important events.

### File Management
Secure file upload and storage with support for multiple file types including PDFs, documents, and code files.

### AI Integration
Powered by Groq AI for intelligent features like code analysis, smart search, and automated grading assistance.

## 🔧 Configuration

### Email Setup (Gmail)
1. Enable 2-Factor Authentication in your Google Account
2. Generate an App Password
3. Use the App Password in your `.env` file

### Groq AI Setup
1. Sign up at [Groq Console](https://console.groq.com)
2. Generate an API key
3. Add the key to your `.env` file

### Cloudinary Setup (Optional)
1. Create account at [Cloudinary](https://cloudinary.com)
2. Get your credentials from the dashboard
3. Add to `.env` file

## 🧪 Testing

```bash
# Run tests (when available)
npm test
```

## 📦 Deployment

### Frontend (Vercel)
```bash
cd client
vercel deploy
```

### Backend (Railway/Render)
1. Push code to GitHub
2. Connect repository to hosting platform
3. Set environment variables
4. Deploy

## 🐛 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 4000 (Backend)
npx kill-port 4000

# Kill process on port 5173 (Frontend)
npx kill-port 5173
```

#### MongoDB Connection Error
- Ensure MongoDB is running: `mongod`
- Check your `MONGO_URI` in `.env`
- Verify MongoDB is installed correctly

#### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Do the same for client and server folders
```

#### CORS Errors
- Verify `FRONTEND_URL` in server `.env` matches your frontend URL
- Check that the backend is running on the correct port

#### Email Not Sending
- Verify SMTP credentials in `.env`
- For Gmail, ensure you're using an App Password, not your regular password
- Check that 2FA is enabled on your Google account

#### AI Features Not Working
- Verify your `GROQ_TOKEN` is valid
- Check Groq API status
- Ensure you have sufficient API credits

### Getting Help
- Check existing [GitHub Issues](https://github.com/CrowdContract/NextGen-EduTrack/issues)
- Create a new issue with detailed error logs
- Join our community discussions

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **CrowdContract Team** - [GitHub](https://github.com/CrowdContract)

## 🙏 Acknowledgments

- React and Node.js communities
- Groq AI for AI capabilities
- All contributors and testers

## 📞 Support

For support, arpit0112ak@gmail.com.

## 🗺️ Roadmap

- [ ] Mobile application (React Native)
- [ ] Video conferencing integration
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Integration with university systems
- [ ] Plagiarism detection
- [ ] Automated report generation

---

Made with ❤️ by the CrowdContract Team
