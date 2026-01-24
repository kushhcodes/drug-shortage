# 🛠️ Technology Stack & Architecture

## 1. Frontend (User Interface)
The frontend is built with a modern React stack, focusing on performance, type safety, and component reusability.

*   **Framework**: [React.js](https://react.dev/) (v18)
*   **Build Tool**: [Vite](https://vitejs.dev/) (Fast build and hot module replacement)
*   **Language**: [TypeScript](https://www.typescriptlang.org/) (Static typing for reliability)
*   **Styling**:
    *   **Tailwind CSS**: Utility-first CSS framework for rapid UI development.
    *   **Lucide React**: Modern, consistent icon set.
*   **State Management & Data**:
    *   **React Hooks**: Standard state management.
    *   **Fetch API**: For communicating with the Backend REST API.
*   **Routing**: React Router (Single Page Application navigation).

## 2. Backend (API & Logic)
The backend is a robust RESTful API built with Python and Django, designed to handle complex logic and ML integration.

*   **Framework**: [Django](https://www.djangoproject.com/) (High-level Python web framework)
*   **API Framework**: [Django REST Framework (DRF)](https://www.django-rest-framework.org/) (For building Web APIs)
*   **Language**: [Python](https://www.python.org/) (v3.12+)
*   **Authentication**:
    *   **JWT (JSON Web Tokens)**: Secure, stateless authentication via `djangorestframework-simplejwt`.
*   **Documentation**:
    *   **Swagger / OpenAPI 3.0**: Automated API documentation using `drf-spectacular`.

## 3. Database & Storage
*   **Primary Database**: [PostgreSQL](https://www.postgresql.org/) (Production-grade relational database)
    *   *Note: SQLite is used for local development for simplicity.*
*   **ORM**: Django ORM (Object-Relational Mapping for secure database interactions).

## 4. Machine Learning (AI Core)
The predictive engine is an integrated Python module running within the Django backend.

*   **Libraries**:
    *   **Scikit-Learn**: Core ML algorithms (Random Forest / Gradient Boosting).
    *   **Pandas & NumPy**: Data manipulation and feature engineering.
*   **Model**: Time-series forecasting model (predicts future stock levels based on historical usage and reorder trends).
*   **Integration**: Saved as `.pkl` (Pickle) files and loaded into memory for real-time inference via API endpoints.

## 5. Deployment & DevOps
*   **Platform**: [Render](https://render.com/) (Cloud hosting for web services).
*   **Server**: **Gunicorn** (WSGI HTTP Server for UNIX).
*   **Static Files**: **WhiteNoise** (Serving static assets directly from Django).
*   **Environment Management**: `python-dotenv` for secure configuration variables.

---

## 🏗️ System Architecture Diagram

```mermaid
graph TD
    User[End User / Hospital Staff] -->|HTTPS| Frontend[React + Vite Frontend]
    Frontend -->|REST API (JSON)| Backend[Django REST API]
    Backend -->|Auth (JWT)| Auth[Authentication System]
    Backend -->|Query| DB[(PostgreSQL Database)]
    Backend -->|Input Data| ML[ML Prediction Model]
    ML -->|Risk Level / Probability| Backend
    Backend -->|Response| Frontend
```
