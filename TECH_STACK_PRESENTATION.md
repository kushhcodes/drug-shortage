# 🛠️ Tech Stack & Architecture - Drug Shortage Prediction System

This document outlines the technologies used to build the AI-Powered Drug Shortage Prediction System.

---

## 🚀 **Frontend (User Interface)**
*   **Framework**: **React.js** (v18) - For building a dynamic and responsive user interface.
*   **Build Tool**: **Vite** - For lightning-fast development server and optimized production builds.
*   **Language**: **TypeScript** - Ensures type safety and reduces bugs.
*   **Styling**: **Tailwind CSS** - Utility-first CSS framework for rapid, modern UI design.
*   **UI Components**: **Shadcn/UI** (based on Radix UI) - Accessible and customizable pre-built components (Cards, Buttons, Inputs).
*   **Icons**: **Lucide React** - Clean and modern SVG icons.
*   **Charts**: **Recharts** - For visualizing risk distribution and shortage timelines.
*   **State Management**: **React Context API** - Managing Authentication user state globally.
*   **Routing**: **React Router DOM** - Handling navigation between Dashboard, Login, and Inventory pages.

---

## 🔙 **Backend (API & Logic)**
*   **Framework**: **Django** (Python) - Robust web framework for secure and scalable backend logic.
*   **API Framework**: **Django REST Framework (DRF)** - For building standard RESTful APIs.
*   **Authentication**: **JWT (JSON Web Tokens)** via `SimpleJWT` - Secure, stateless authentication for login and sessions.
*   **Database ORM**: **Django ORM** - Interacting with the database using Python objects instead of raw SQL.
*   **CORS**: **Django CORS Headers** - Handling Cross-Origin Resource Sharing for frontend-backend communication.

---

## 🧠 **AI & Machine Learning (The Brain)**
*   **Language**: **Python** (The standard for Data Science).
*   **Model**: **XGBoost (Extreme Gradient Boosting)** - A high-performance gradient boosting library optimized for speed and accuracy on tabular data.
    *   *Why?* It outperforms other models on structured inventory data and handles non-linear relationships (like seasonality) exceptionally well.
*   **Data Processing**: **Pandas** & **NumPy** - For cleaning, manipulating, and structuring inventory data before prediction.
*   **Training**: The model learns from historical data including:
    *   Current Stock Levels
    *   Daily Consumption Rates
    *   Seasonality (Month, Monsoon Season, Flu Season)
    *   Hospital Type & Bed Capacity
*   **Output**: Predicts **Risk Level** (Low, Medium, High, Critical) and recommends actions (e.g., "Urgent Restock").

---

## 🗄️ **Database**
*   **Database**: **SQLite** (Local Development) / **PostgreSQL** (Production Ready)
    *   Stores Users, Hospitals, Medicines, Inventory, and Alerts.

---

## 🔄 **DevOps & Tools**
*   **Version Control**: **Git** & **GitHub**
*   **API Testing**: **Postman** (Comprehensive collection for all endpoints)
*   **Package Management**:
    *   **npm** (Frontend)
    *   **pip** (Backend)

---

## 🏗️ **System Architecture**
1.  **Client**: The React Frontend sends HTTP requests (GET/POST) to the Backend.
2.  **API Layer**: Django REST Framework receives requests, validates permissions (JWT), and processes data.
3.  **Logic Layer**:
    *   **Inventory Manager**: Handles CRUD operations for medicines.
    *   **ML Forecaster**: When a prediction is requested, it loads the trained XGBoost model, featurizes the data, and returns a risk probability.
4.  **Data Layer**: The Database stores the persistent state of the application.

---

## ✨ **Key Features Implemented**
*   **🔐 Secure Auth**: Login/Register with JWT tokens.
*   **📊 Interactive Dashboard**: Real-time view of stock levels and risks.
*   **🤖 AI Predictions**: On-demand forecasting of drug shortages.
*   **⚠️ Alert System**: Automated generation of alerts for critical items.
*   **📱 Responsive Design**: Works on Desktop and Tablets.
