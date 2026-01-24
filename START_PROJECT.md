# 🚀 How to Start the Drug Shortage Prediction System

Your project is fully set up with a Django backend and a React (Vite) frontend. Here is how to run it.

## 1. Prerequisites (Already Done)
- Backend dependencies installed.
- Frontend dependencies installed.
- Database migrated and seeded with test data.
- **Test User**: `test@admin.com` / `admin123`

## 2. Start the Backend (Terminal 1)
Open a terminal and run the Django server:

```bash
cd backend
python3 manage.py runserver
```
*   The backend will start at `http://127.0.0.1:8000`.
*   Keep this terminal open.

## 3. Start the Frontend (Terminal 2)
Open a **new** terminal tab/window and run the Vite dev server:

```bash
cd frontend
npm run dev
```
*   The frontend will start at `http://localhost:8080`.
*   Keep this terminal open.

## 4. Open in Browser
1.  Go to **[http://localhost:8080](http://localhost:8080)** in your browser.
2.  Log in with:
    *   **Email**: `test@admin.com`
    *   **Password**: `admin123`

## 5. System Architecture
*   **Frontend**: React + Vite (Port 8080) -> Sends requests to API.
*   **Backend**: Django REST Framework (Port 8000) -> Processes requests & connects to Database.
*   **Database**: SQLite/Postgres -> Stores data.
*   **ML Model**: Python/Scikit-Learn -> Runs predictions in the backend.

## Troubleshooting
*   **Login Failed?** Check if the backend terminal shows any errors. Ensure you are using the correct credentials.
*   **Network Error?** Ensure the backend is running on port 8000.
