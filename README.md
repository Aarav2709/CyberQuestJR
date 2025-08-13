# 🛡️ CyberQuest Jr

**An AI-powered cybersecurity education platform for kids aged 8-18!**

Transform young minds into cyber heroes with personalized, engaging cybersecurity education powered by Google Gemini AI.

## ✨ Features

- 🤖 **AI-Powered Content Generation** - Google Gemini 2.0 creates personalized cybersecurity lessons
- 🎯 **Pre-made Quizzes** - Hand-crafted assessments for each learning module
- 📚 **Dynamic Course Creation** - AI generates comprehensive courses with examples and explanations
- 🎨 **Kid-Friendly Design** - Colorful, vibrant interface designed specifically for children
- 🔄 **Automatic User Management** - Zero-setup experience - just visit and start learning!
- � **Instant Learning** - No registration, no setup, no barriers to education
- 🧠 **Smart Content** - AI adapts explanations to be age-appropriate and engaging

## 🎓 Available Courses

Our AI generates comprehensive content for these cybersecurity topics:

1. **🔐 Password Heroes** - Creating and managing strong passwords
2. **🕵️ Phishing Detective** - Identifying and avoiding phishing attacks
3. **� Digital Footprints** - Understanding your online presence
4. **📱 Social Media Safety** - Safe practices on social platforms
5. **🛡️ Cyber Bullying Defense** - Handling online harassment
6. **🔒 Privacy Guardian** - Protecting personal information online

Each course includes:

- ✅ AI-generated comprehensive explanations
- ✅ Real-world examples and scenarios
- ✅ Age-appropriate language and concepts
- ✅ Interactive pre-made quizzes
- ✅ Progress tracking and completion certificates

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Google Gemini API Key (free from Google AI Studio)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Aarav2709/CyberQuestJR.git
   cd CyberQuestJR
   ```

2. **Setup Environment Variables**

   ```bash
   cd backend
   echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env
   ```

3. **Install Backend Dependencies**

   ```bash
   pip install -r requirements.txt
   ```

4. **Install Frontend Dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

5. **Start Backend Server**

   ```bash
   cd ../backend
   python app.py
   ```

6. **Start Frontend Development Server**

   ```bash
   cd ../frontend
   npm run dev
   ```

7. **Visit the Application**
   Open your browser to `http://localhost:3000` and start learning! 🎉

## 🤖 AI Integration Setup

### Get Your Google Gemini API Key

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign up for a free account
3. Navigate to "Get API Key"
4. Create a new API key
5. Copy the key to your `.env` file in the backend directory

The AI features require this API key to generate personalized course content.

## 🏗️ Architecture

### Backend (Flask + SQLAlchemy + Google Gemini AI)

- **Flask API Server** running on port 8000
- **Google Gemini 2.0-flash-exp** for AI content generation
- **SQLite Database** for user progress and course data
- **Automatic CORS** handling for frontend integration

### Frontend (React + TypeScript + Vite)

- **React 18** with TypeScript for type safety
- **Vite** for fast development and building
- **Tailwind CSS** for beautiful, responsive design
- **Automatic user creation** - no manual setup required

```
CyberQuestJR/
├── backend/
│   ├── app.py                 # Main Flask application with AI integration
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables (create this)
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   │   └── Navbar.tsx     # Navigation bar
│   │   ├── pages/             # Main application pages
│   │   │   ├── Dashboard.tsx  # Course selection dashboard
│   │   │   └── CourseDetail.tsx # AI-generated course content
│   │   ├── services/          # API integration
│   │   │   └── api.ts         # Backend communication
│   │   └── types/             # TypeScript type definitions
│   │       └── index.ts       # Shared interfaces
│   ├── package.json           # Node.js dependencies
│   ├── tailwind.config.js     # Styling configuration
│   └── vite.config.ts         # Build configuration
├── deployment/                # Setup scripts
│   ├── linux.sh              # Linux deployment script
│   └── windows.bat           # Windows deployment script
└── README.md                 # This file
```

## � How It Works

1. **Visit the Website** - No registration needed, automatic user creation
2. **Browse Colorful Dashboard** - Kid-friendly interface with vibrant course cards
3. **Select a Course** - Click on any cybersecurity topic that interests you
4. **AI Generates Content** - Google Gemini creates personalized, age-appropriate lessons
5. **Learn and Practice** - Read comprehensive explanations with real-world examples
6. **Take Quizzes** - Test knowledge with hand-crafted assessment questions
7. **Track Progress** - Automatic progress saving and completion tracking

## 🔧 Troubleshooting

### Backend Issues

**Google Gemini API Key Missing:**

```bash
cd backend
echo "GEMINI_API_KEY=your_actual_api_key_here" > .env
```

**Python Dependencies:**

```bash
cd backend
pip install flask flask-cors requests google-generativeai python-dotenv sqlalchemy
```

**Backend Not Starting:**

- Ensure Python 3.8+ is installed
- Check that port 8000 is available
- Verify `.env` file exists with valid Gemini API key

### Frontend Issues

**Node.js Dependencies:**

```bash
cd frontend
npm install
```

**Port Issues:**

- Frontend runs on port 3000 (development) or served by backend on port 8000 (production)
- Backend API runs on port 8000
- Ensure both ports are available

**CORS Issues:**

- Backend automatically handles CORS for localhost:3000
- No additional configuration needed

## 🌟 Key Features Explained

### ✨ Automatic User Creation

- **Zero Setup:** Users are automatically created on first visit
- **Persistent:** User data saved in localStorage for return visits
- **Resilient:** Automatic recovery if user data is lost

### 🤖 AI-Powered Content Generation

- **Google Gemini Integration:** Uses latest AI models for content creation
- **Age-Appropriate:** Content automatically adapted for young learners
- **Comprehensive:** Full course materials with explanations and examples
- **Fresh Content:** New content generated for each course visit

### 🎨 Kid-Friendly Design

- **Vibrant Colors:** Rainbow gradients and bright, engaging visuals
- **Simple Navigation:** Easy-to-use interface designed for children
- **No Distractions:** Removed animations and complex elements
- **Mobile Responsive:** Works perfectly on tablets and phones

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## � Educational Impact

**Why CyberQuest Jr Matters:**

- 🌍 **Digital Natives Need Digital Safety:** Today's kids are online from an early age
- 🧠 **Early Education Works:** Teaching cybersecurity concepts young builds lasting habits
- 🎮 **Engagement Through Technology:** AI-powered personalization keeps kids interested
- 🔒 **Building Digital Citizens:** Creating a generation that understands online safety

**Learning Outcomes:**

- Understand password security and best practices
- Recognize phishing attempts and online scams
- Manage digital footprints and online privacy
- Practice safe social media usage
- Handle cyberbullying situations effectively
- Protect personal information online

## 🌟 Acknowledgments

- **Google Gemini AI** for powering intelligent content generation
- **React Community** for the amazing frontend framework
- **Flask** for the lightweight, powerful backend
- **Tailwind CSS** for beautiful, responsive styling
- **All contributors** who help make cybersecurity education accessible

---

**🚀 Ready to create cyber heroes? Clone, setup, and start educating the next generation!**

_Made with ❤️ for digital safety education_
