# 🏋️ FitAI – Adaptive Fitness Coach

FitAI is an AI-powered fitness and nutrition planning platform that generates personalized workout and meal plans based on a user's goals, lifestyle, dietary preferences, budget, and activity level.

The application combines intelligent recommendation logic, user authentication, progress tracking, and a modern responsive UI to deliver a complete fitness planning experience.

---

## 🚀 Features

### 👤 User Management
- User Registration & Login
- Secure Authentication
- Personalized Dashboard

### 🏋️ Workout Planning
- AI-based Workout Plan Generation
- Goal-specific recommendations
  - Weight Loss
  - Muscle Gain
  - Maintenance
- Activity-Level Based Plans
- Adaptive Plan Adjustments

### 🍽 Nutrition Planning
- Personalized Meal Recommendations
- Diet Preference Support
  - Vegetarian
  - Non-Vegetarian
  - Vegan
- Regional Meal Suggestions
- Budget-Based Meal Filtering

### 📊 Progress Tracking
- User Fitness History
- Plan Performance Tracking

### 📚 Additional Features
- Fitness Blogs Section
- Meal Database
- Workout Database with 600+ meals
- Responsive Modern UI
- Dark/Light Theme Support

---

## 🛠 Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- JavaScript

### Backend
- Python
- Flask
- REST APIs

### Database
- PostgreSQL

### DevOps & Tools
- Docker
- Git
- GitHub

---

## 📂 Project Structure

```bash
FitAI/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app.py
│   ├── database.py
│   ├── engine.py
│   ├── meal_engine.py
│   └── requirements.txt
│
├── docker-compose.yml
├── Dockerfile
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```bash
git clone https://github.com/2akj24/FitAI-Adaptive-Fitness-Coach.git
cd FitAI-Adaptive-Fitness-Coach
```

### 2️⃣ Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt
```

### 3️⃣ Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

### 4️⃣ Configure Environment Variables

Create a `.env` file inside the backend directory:

```env
API_KEY=your_openrouter_api_key

DB_HOST=localhost
DB_PORT=5432
DB_NAME=fitai
DB_USER=postgres
DB_PASSWORD=your_password
```

---

## 🐳 Running With Docker

Build and start all services:

```bash
docker compose up --build
```

Run in detached mode:

```bash
docker compose up -d
```

Stop containers:

```bash
docker compose down
```

---

## 📸 Screenshots

Add application screenshots here:

- Home Page
- Workout Planner
- Meal Planner
- Dashboard
- Blogs Section

---

## 🎯 Future Enhancements

- AI Chat Fitness Assistant
- Workout Video Recommendations
- Progress Analytics Dashboard
- Mobile App Version
- Fitness Goal Prediction
- Smart Notifications & Reminders

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push branch

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Abhinav Kumar Jha**

Backend Developer

- Python
- Java
- Flask
- PostgreSQL
- Docker
- REST APIs

⭐ If you found this project useful, please consider giving it a star.
