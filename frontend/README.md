# 🥗 MealMind

**MealMind** is a smart meal planning web app that helps you organize your weekly diet, track your macros, and never forget what to buy at the supermarket.

---

## What can you do with MealMind?

### Create your own recipes
Build your personal recipe library by searching from a database of 187+ ingredients with nutritional values already calculated. MealMind automatically computes the total calories, protein, carbs and fat for each recipe.

### Track your macros
Every recipe shows a detailed macro breakdown so you always know what you're eating. No manual calculations needed — MealMind does the math for you.

### Plan your weekly meals
Assign recipes to each meal of the day (breakfast, lunch and dinner) for every day of the week. Get a clear overview of your entire week at a glance.

### Generate your shopping list
Once your week is planned, MealMind automatically generates a shopping list with all the ingredients you need and the exact quantities. Check items off as you shop and mark the plan as complete when you're done.

### Personalize your account
Update your username, email and password from your profile at any time.

---

## Getting started

1. **Register** — create your account and get 30 starter recipes automatically added to your library
2. **Explore recipes** — browse your recipes or create new ones with the ingredient search
3. **Plan your week** — go to the Planner, pick a start date and assign recipes to each meal
4. **Shop smarter** — generate your shopping list and check items off as you buy them

---

## Tech stack

**Frontend**
- React + Vite
- Tailwind CSS
- React Router

**Backend**
- Python + Flask
- SQLAlchemy + PostgreSQL
- Flask-JWT-Extended

**Deploy**
- Frontend → Vercel
- Backend + Database → Railway

---

##  Development setup

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python run.py
python seed_foods.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Environment variables

**backend/.env**
```
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret
DATABASE_URL=sqlite:///mealmind.db
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

---

## Live demo

[MealMind](https://meal-mind-r2dihsick-angeldpls-projects.vercel.app)

---

Made with ❤️ and 🥕