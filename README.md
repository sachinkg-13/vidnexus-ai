# AI Notes Generator

A full-stack application that generates summaries, flashcards, and quizzes from YouTube videos using Gemini AI.

## Tech Stack

- **Backend**: Django, Django REST Framework, SimpleJWT
- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Database**: SQLite (default for manual run), MySQL (optional)
- **AI**: Gemini Pro (via `google-generativeai`)

## Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- Gemini API Key

## Setup & Running

### 1. Backend

```bash
cd backend
python -m venv venv
# Activate venv: venv\Scripts\activate (Windows) or source venv/bin/activate (Unix)
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Database (MySQL)

This project allows manual execution but requires a MySQL database.

#### Option A: Docker (Recommended for DB only)

Run a standalone MySQL container:

```bash
docker run --name ai-notes-db -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=ai_notes -p 3306:3306 -d mysql:8.0
```

#### Option B: Local MySQL

1. Install MySQL Server.
2. Create a database named `ai_notes`.
3. Update `backend/.env` with your credentials (`DATABASE_USER`, `DATABASE_PASSWORD`, etc.).

### 4. Environment Variables

Create a `.env` file in the `backend/` directory:

```
GEMINI_API_KEY=your_key
DATABASE_NAME=ai_notes
DATABASE_USER=root
DATABASE_PASSWORD=root
DATABASE_HOST=localhost
DATABASE_PORT=3306
```

## Access

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000/api/

## Usage

1. Register/Login (create a user via Django Admin `python manage.py createsuperuser` or strict API).
2. Enter a YouTube URL in the Dashboard.
3. Wait for AI generation ("AI is reading the video...").
4. View Summary, Flashcards, and Quiz.
