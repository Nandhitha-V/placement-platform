# Placement Platform

A full-stack learning platform for placement preparation, built to demonstrate real-world web development skills — authentication, database design, interactive learning content, and progress tracking.

> **Status:** Active development (MVP complete for the DSA category)
> **Live demo:** _add link if/when deployed_

---

## Overview

Placement Platform is a structured, interactive learning tool aimed at helping students prepare for technical placements. Rather than static reading material, each lesson combines an explanation, a hand-built interactive visualization of the concept, and a server-graded quiz — with progress tracked per user.

This project was built as a full-stack learning exercise, with an emphasis on understanding every layer of the stack rather than scaffolding it with a framework or template.

---

## Features

**Implemented (MVP):**
- User registration and login with JWT-based authentication
- Secure password hashing (bcrypt) — no plain-text passwords ever stored
- Protected API routes via custom auth middleware
- Structured learning content: Category → Course → Lesson (MongoDB referencing)
- Two full interactive DSA lessons (Arrays, Stacks) with custom CSS/JS visualizations
- Multiple-choice assessments with **server-side grading** (answers never exposed to the client before submission)
- Per-user progress tracking (attempts, scores, accuracy)
- Real dashboard showing aggregated progress stats
- Fully responsive-ready plain HTML/CSS/JS frontend (no framework dependency)

**Planned:**
- Additional DSA topics (Queues, Linked Lists, Trees, Sorting, Searching)
- Deeper lesson content (currently minimal placeholder content, written to prove the architecture — comprehensive content is a dedicated upcoming phase)
- Coding problem editor with test-case execution
- Gamification (streaks, XP, achievements)
- Admin panel for content management
- AI-narrated video lessons (schema already supports a `videoUrl` field for future use)
- Additional categories beyond DSA (Aptitude, Communication, Soft Skills)

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript | Learn core web fundamentals before introducing framework abstractions |
| Backend | Node.js, Express.js | Industry-standard, lightweight, pairs naturally with a JSON-based frontend |
| Database | MongoDB (Atlas), Mongoose | Flexible schema suited to varied lesson content; JSON-native fit with Node |
| Auth | JWT, bcrypt | Stateless authentication; industry-standard password security |
| Tooling | Git, GitHub, Thunder Client, VS Code | Version control and API testing throughout development |

---

## Architecture

### Data model relationships

```
Category (e.g. "DSA")
   └── Course (e.g. "DSA Fundamentals")
         └── Lesson (e.g. "Arrays", "Stacks")
               └── Question (MCQs, linked to a Lesson)

User
   └── Attempt (records a user's score per lesson, linked to User + Lesson)
```

MongoDB documents reference each other by `ObjectId` (similar in spirit to SQL foreign keys). Mongoose's `.populate()` is used to resolve these references at query time — including nested population (e.g., fetching a Lesson also resolves its Course, which in turn resolves its Category).

### Request flow example (submitting a quiz)

```
Frontend (lesson.html)
   → collects answers, attaches JWT from localStorage
   → POST /api/questions/submit
Backend (protect middleware)
   → verifies JWT, attaches req.user
Backend (questionController.submitAnswers)
   → re-fetches each Question from DB (never trusts client-sent answers)
   → grades server-side, saves an Attempt document
   → returns score + explanations
Frontend
   → renders results, updates dashboard on next visit
```

### Security decisions worth noting
- Passwords are hashed with bcrypt (salted) before storage — never stored or logged in plain text
- Quiz correct answers are excluded from the API response until *after* grading, preventing client-side inspection/cheating
- All grading logic runs server-side; the client only ever sends the user's selected answers, never a score
- JWT secret and database credentials are stored in a `.env` file, excluded from version control via `.gitignore`

---

## Project Structure

```
placement-platform/
├── client/                 # Frontend (plain HTML/CSS/JS)
│   ├── css/
│   ├── js/
│   ├── index.html          # Landing page
│   ├── register.html
│   ├── login.html
│   ├── dashboard.html
│   ├── lessons.html        # Lesson list
│   └── lesson.html         # Single lesson view (content + animation + quiz)
├── server/                 # Backend (Node/Express)
│   ├── config/             # Database connection
│   ├── models/             # Mongoose schemas
│   ├── controllers/        # Route logic
│   ├── routes/             # API route definitions
│   ├── middleware/         # Auth protection
│   └── server.js           # Entry point
└── README.md
```

---

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (free tier is sufficient), or a local MongoDB instance

### 1. Clone the repository
```bash
git clone https://github.com/Nandhitha-V/placement-platform.git
cd placement-platform
```

### 2. Backend setup
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret_string
PORT=5000
```

Start the backend:
```bash
node server.js
```
You should see:
```
Server is running on http://localhost:5000
MongoDB connected successfully
```

### 3. Frontend setup
No build step required. Open `client/index.html` directly in a browser, or use a tool like VS Code's Live Server extension for auto-reload during development.

**Note:** the backend must be running for the frontend to function, since all data is fetched live from the API.

---

## API Documentation

### Auth
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| POST | `/api/auth/register` | Create a new user account | No |
| POST | `/api/auth/login` | Log in, returns a JWT | No |
| GET | `/api/auth/me` | Get the logged-in user's profile | Yes |

### Categories / Courses / Lessons
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| GET | `/api/categories` | List all categories | No |
| POST | `/api/categories` | Create a category | No |
| GET | `/api/courses` | List all courses (with category populated) | No |
| POST | `/api/courses` | Create a course | No |
| GET | `/api/lessons` | List all lessons | No |
| GET | `/api/lessons/:id` | Get a single lesson (with course + category populated) | No |
| POST | `/api/lessons` | Create a lesson | No |
| DELETE | `/api/lessons/:id` | Delete a lesson | No |

### Questions & Assessments
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| GET | `/api/questions/lesson/:lessonId` | Get questions for a lesson (answers hidden) | No |
| POST | `/api/questions` | Create a question | No |
| POST | `/api/questions/submit` | Submit answers for grading | **Yes** |

### Progress
| Method | Endpoint | Description | Protected |
|---|---|---|---|
| GET | `/api/progress/dashboard` | Get the logged-in user's aggregated progress | **Yes** |

> Content-creation routes (categories/courses/lessons/questions) are currently open for development convenience. These will require admin authentication before any public deployment.

---

## Database Design

**User**
```
name, email (unique), password (hashed), timestamps
```

**Category**
```
name (unique), description, icon, timestamps
```

**Course**
```
title, description, category (ref: Category), order, timestamps
```

**Lesson**
```
title, course (ref: Course), order, content, hasAnimation, videoUrl (reserved for future use), timestamps
```

**Question**
```
lesson (ref: Lesson), questionText, options[], correctAnswerIndex, explanation, order, timestamps
```

**Attempt**
```
user (ref: User), lesson (ref: Lesson), score, totalQuestions,
answers: [{ question (ref: Question), selectedIndex, isCorrect }], timestamps
```

---

## Key Learnings

Building this project surfaced several concrete lessons, worth noting for anyone reviewing this repo:

- **Express middleware order matters.** `express.json()` must be registered before any route that reads `req.body`, or the body arrives as `undefined`.
- **MongoDB references vs. embedding** is a deliberate design decision, not a default — this project uses references (with `.populate()`) since lesson content is large and queried independently, unlike small always-together data.
- **Never trust client-submitted grading data.** The quiz submission endpoint re-fetches the correct answer from the database server-side on every submission, rather than trusting anything sent from the browser.
- **JWT payloads are readable, not secret** — only the signature prevents tampering. Sensitive data should never be placed inside a JWT payload.

---

## Roadmap

See [Project Phases](#) _(internal planning doc)_ for the full phased roadmap. Current focus: expanding lesson content depth and additional DSA topics before broadening to other categories (Aptitude, Communication, Soft Skills).

---

## Author

**Nandhitha V**
GitHub: [@Nandhitha-V](https://github.com/Nandhitha-V)

Built as a hands-on full-stack learning project — every line of this codebase was written with an understanding of *why*, not just *how*.
