# 🚀 How to Deploy Your Project to Render.com

Your project is fully configured for deployment on Render.com! Follow these steps to get it live.

## 📋 Prerequisites
- A GitHub account
- A Render.com account (Free)

---

## 1️⃣ Push Your Code to GitHub

First, you need to push your code to a GitHub repository.

1. **Initialize Git (if not already done)**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Ready for deployment"
   ```

2. **Create a Repo on GitHub**:
   - Go to [GitHub.com](https://github.com/new)
   - Create a new repository (e.g., `drug-shortage-prediction`)

3. **Push Code**:
   ```bash
   git remote add origin https://github.com/<YOUR_USERNAME>/drug-shortage-prediction.git
   git branch -M main
   git push -u origin main
   ```

---

## 2️⃣ Deploy on Render (Easiest Method)

We have created a `render.yaml` file (Infrastructure as Code) which makes deployment automatic.

1. **Go to Render Console**: [dashboard.render.com](https://dashboard.render.com/blueprints)
2. Click **"New +"** → select **"Blueprint"**
3. Connect your GitHub account and select your `drug-shortage-prediction` repository.
4. Give it a name (e.g., `drug-shortage-app`) and click **"Apply"**.

**Render will now magically:**
- ✅ Create a fully managed PostgreSQL database
- ✅ Deploy your Django Backend
- ✅ Build & Deploy your React Frontend

---

## 3️⃣ Post-Deployment Configuration

Once deployed, you need to link the Frontend and Backend URLs correctly.

### Step 3.1: Get Your URLs
In the Render Dashboard, you will see two services:
1. `drug-shortage-api` (Backend) - URL looks like `https://drug-shortage-api-xyz.onrender.com`
2. `drug-shortage-frontend` (Frontend) - URL looks like `https://drug-shortage-frontend-xyz.onrender.com`

### Step 3.2: Update Environment Variables

**Go to Backend (`drug-shortage-api`) -> Environment:**
- Find `CORS_ALLOWED_ORIGINS`
- Edit it to be your actual Frontend URL: `https://drug-shortage-frontend-xyz.onrender.com` (no trailing slash)
- **Save Changes** (Backend will redeploy)

**Go to Frontend (`drug-shortage-frontend`) -> Environment:**
- Add/Edit `VITE_API_BASE_URL`
- Set it to your actual Backend URL: `https://drug-shortage-api-xyz.onrender.com`
- **Save Changes** (Frontend will redeploy)

---

## 4️⃣ Create Superuser in Production

Once the database is running, you need an admin user.

1. Go to your **Backend Service** on Render.
2. Click on the **"Shell"** tab (this gives you terminal access to the live server).
3. Run this command:
   ```bash
   cd backend
   python manage.py createsuperuser
   ```
4. Enter credentials (e.g., `admin@example.com` / `securepassword`).

---

## 🎉 You're Live!

Visit your Frontend URL (`https://drug-shortage-frontend-xyz.onrender.com`) and login!

### Troubleshooting
- **Build Failures**: Check the "Logs" tab in Render for error messages.
- **Database Errors**: Ensure the `DATABASE_URL` env var is green/connected in the Blueprint dashboard.
