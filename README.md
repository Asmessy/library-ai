<<<<<<< HEAD
# 📚 AI Library Management System

A complete full-stack web application designed to be beginner-friendly, clean, and production-structured. This system allows users to browse a book catalog, borrow/return books, and receive simple AI-powered book recommendations based on their borrowing history.

## ✨ Features

### 🔐 Authentication System
- Secure user registration and login with JWT (JSON Web Tokens).
- Passwords are encrypted using `bcryptjs`.
- Separate specific features for basic users and admins.

### 📖 Book Catalog
- Browse available books through a modern, card-based interface.
- Search functionality by Title and Author.
- Filter books by categories (Technology, Self Help, Finance, Fiction, History).
- Clean indications of whether a book is 'Available' or 'Borrowed'.

### 🔄 Borrow and Return System
- Authenticated users can borrow available books with a single click.
- User Dashboard displays currently borrowed items with their borrow dates.
- Users can return books directly from their dashboard.

### 🤖 AI Recommendation logic
- The backend tracks the categories of books each user borrows.
- It identifies the semantic category the user borrows most frequently.
- The dashboard automatically recommends 5 available books from that most-borrowed category that the user hasn't already read/borrowed.

### 🛠️ Admin Panel
- Dedicated dashboard for Admin users.
- Add new books to the catalog database.
- View all library inventory in a clean data table.
- Delete records directly from the application.

## 🛠️ Technology Stack

- **Frontend**: React.js (built with Vite)
- **Styling**: Tailwind CSS & Lucide Icons
- **Routing**: React Router DOM (v6)
- **Backend API**: Node.js with Express.js
- **Database**: SQLite (No cloud setup required)
- **Interactions**: Axios for fetching data

## 🗄️ Database Design

The application utilizes a local SQLite database with three core tables:

1. **Users**
   - `user_id` (Primary Key)
   - `name`, `email`, `password`, `role` (user/admin)

2. **Books**
   - `book_id` (Primary Key)
   - `title`, `author`, `category`, `availability_status` (Available/Borrowed)

3. **BorrowedBooks**
   - `borrow_id` (Primary Key)
   - `user_id` (Foreign Key -> Users)
   - `book_id` (Foreign Key -> Books)
   - `borrow_date`, `return_date`, `status` (Borrowed/Returned)

*A database seed file is included, which auto-populates 20 sample books and an admin user upon first startup.*

## 🚀 How to Run Locally

### Prerequisites
- Node.js installed on your machine (v18+ recommended)

### 1. Start the Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd library-ai/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on port 5000):
   ```bash
   npm start
   ```
   *Note: On the first run, the SQLite database (`library.db`) will be automatically generated and populated with sample data.*

### 2. Start the Frontend
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd library-ai/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000` (or the URL Vite provides).

### Default Accounts
- **Admin**: Email: `admin@library.ai` | Password: `password`
- **User**: Email: `john@example.com` | Password: `password`

## 🔮 Future Improvements

- Add pagination for the book catalog and admin tables.
- Integrate an external LLM (like OpenAI) to provide more semantic specific recommendations rather than simple category matching.
- Add user profile image uploads via Cloudinary.
- Implement soft-deletes and historical borrow tracking graphs for the Admin panel.
- Add due dates and fine calculations for overdue returns.
=======
# library-ai
>>>>>>> 224b2ef6ae857d6683a8a825f87b034a9514176b
