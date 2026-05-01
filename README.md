# WANGUHU ESTATE WELFARE SELF HELP GROUP (WEWSHG) Management System

A comprehensive management system for the WEWSHG community to track contributions, assets, and member data.

## 🚀 Tech Stack

- **Frontend**: React (TypeScript), Vite, TailwindCSS
- **Backend**: Node.js (Express), TypeScript
- **Database**: PostgreSQL
- **Auth**: JWT (JSON Web Tokens)

## 🛠️ Project Structure

- `frontend/`: React application (Vite-based)
- `backend/`: Express server (TypeScript)
- `plan/`: Architectural and business logic documentation
- `qr/`: QR code generation utilities

## 🏁 Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd "WANGUHU ESTATE WELFARE SELF HELP GROUP"
    ```

2.  **Backend Setup**:
    ```bash
    cd backend
    npm install
    # Create .env file (see .env.example)
    npm run dev
    ```

3.  **Frontend Setup**:
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```

## 🔐 Environment Variables

### Backend (`backend/.env`)
- `PORT`: Server port (default: 5555)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT signing

### Frontend (`frontend/.env`)
- `VITE_API_URL`: Backend API URL (default: http://localhost:5555/api)

## 🗺️ User Flow

1.  **Visitor**: Can view landing page, products, and services.
2.  **User**: Can login to access their personal dashboard and track contributions.
3.  **Board Member**: Full management access (assets, bills, community contributions).

## 📄 License

This project is private to WEWSHG.
