🚀 SEO Tracker & Website Analysis Platform

A full-stack SEO Tracking and Website Analysis platform that helps users monitor keyword rankings, analyze website SEO performance, generate reports, and track historical SEO data.

🌟 Features
🔐 Authentication System
User Registration & Login
JWT Authentication
Protected Routes
Secure Password Storage
📊 SEO Analysis
Website SEO Audits
Meta Tag Analysis
Heading Structure Analysis
Performance Metrics
SEO Score Calculation
📈 Rank Tracking
Track Keyword Rankings
Monitor Target Domains
Store Ranking History
Keyword Position Tracking
Ranking Trend Analysis
📑 Reports
Generate SEO Reports
Download Analysis Results
Historical Comparison
Performance Overview
🕒 History Management
View Previous Analyses
Store SEO Audit Records
Track Changes Over Time
🎨 Modern Dashboard
Responsive Design
Interactive Charts
User-Friendly Interface
Real-Time Updates
🛠️ Tech Stack
Frontend ⚛️
React.js
TypeScript
React Router DOM
Axios
Tailwind CSS
ShadCN UI
Radix UI
Lucide React
React Hot Toast
Backend 🖥️
Node.js
Express.js
JWT Authentication
bcrypt.js
dotenv
Database 🗄️
MongoDB
Mongoose ODM
SEO & Scraping Tools 🔍
Playwright
Browserbase
Cheerio
Axios
Development Tools ⚙️
Vite
Nodemon
Git
GitHub
Postman
📂 Project Structure
SEO-TRACKER/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── services/
│   │
│   └── public/
│
├── server/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   └── utils/
│
├── .env
├── package.json
└── README.md
Website Analysis Flow:
User Enters Website URL
          │
          ▼
Frontend Sends Request
          │
          ▼
Backend Receives URL
          │
          ▼
Website Data Scraped
(Cheerio / Playwright)
          │
          ▼
SEO Metrics Calculated
          │
          ▼
SEO Score Generated
          │
          ▼
Data Stored in MongoDB
          │
          ▼
Results Displayed
📈 Rank Tracking Flow
User Adds Keyword
          │
          ▼
Keyword Saved
          │
          ▼
Browserbase Session Created
          │
          ▼
Google Search Executed
          │
          ▼
Target Domain Found
          │
          ▼
Position Extracted
          │
          ▼
Ranking Stored in MongoDB
          │
          ▼
Displayed on Dashboard
⚙️ Installation
1️⃣ Clone Repository
git clone https://github.com/yourusername/seo-tracker.git

cd seo-tracker
2️⃣ Install Frontend Dependencies
cd client

npm install
3️⃣ Install Backend Dependencies
cd ../server

npm install
4️⃣ Setup Environment Variables

Create a .env file inside the server folder.

PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_jwt_secret

BROWSERBASE_API_KEY=your_browserbase_api_key
5️⃣ Start Backend
npm run dev

Backend Running:

http://localhost:5000
6️⃣ Start Frontend
cd client

npm run dev

Frontend Running:

http://localhost:5173
🔄 Workflow (Step-by-Step)
👤 User Authentication
User Register/Login
        │
        ▼
 JWT Token Generated
        │
        ▼
 Protected Dashboard Access
🔍 Website Analysis Flow
User Enters Website URL
          │
          ▼
Frontend Sends Request
          │
          ▼
Backend Receives URL
          │
          ▼
Website Data Scraped
(Cheerio / Playwright)
          │
          ▼
SEO Metrics Calculated
          │
          ▼
SEO Score Generated
          │
          ▼
Data Stored in MongoDB
          │
          ▼
Results Displayed
📈 Rank Tracking Flow
User Adds Keyword
          │
          ▼
Keyword Saved
          │
          ▼
Browserbase Session Created
          │
          ▼
Google Search Executed
          │
          ▼
Target Domain Found
          │
          ▼
Position Extracted
          │
          ▼
Ranking Stored in MongoDB
          │
          ▼
Displayed on Dashboard
📑 Report Generation Flow
Stored SEO Data
        │
        ▼
Generate Report
        │
        ▼
Display Analysis
        │
        ▼
Export / Download
🗃️ Database Schema Overview
User Collection 👤
{
  name: String,
  email: String,
  password: String,
  createdAt: Date
}
Analysis Collection 📊
{
  userId: ObjectId,
  url: String,
  seoScore: Number,
  metaTags: Object,
  headings: Object,
  status: String,
  createdAt: Date
}
Rank Tracking Collection 📈
{
  userId: ObjectId,
  keyword: String,
  targetUrl: String,
  currentRank: Number,
  history: Array,
  createdAt: Date
}
🔒 Security Features

✅ JWT Authentication

✅ Password Hashing with bcrypt

✅ Protected API Routes

✅ Environment Variables

✅ Secure MongoDB Connection

📸 Screenshots

Add screenshots here:

![Dashboard](screenshots/dashboard.png)

![SEO Analysis](screenshots/analysis.png)

![Rank Tracker](screenshots/rank-tracker.png)

![Reports](screenshots/reports.png)
🚀 Future Improvements
🤖 AI SEO Recommendations
📧 Email Reports
📊 Advanced Analytics
🌎 Multi-Location Rank Tracking
🔔 SEO Alerts & Notifications
📱 Mobile App Support
📈 Ranking Trend Charts
🤝 Contributing

Contributions are welcome!

Fork the repository

Create a feature branch

Commit changes

Push branch

Create Pull Request
⭐ Support

If you found this project useful:

🌟 Star the repository

🍴 Fork the project

📢 Share with others

👨‍💻 Author

Naveev Niranjan

Made with ❤️ using React, Node.js, Express, MongoDB, Playwright & Browserbase. 🚀
