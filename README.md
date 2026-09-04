# Task Manager

A full-stack task management application with a React and Vite frontend and an
Express API backed by SQLite.

## Features

- Create, edit, complete, and delete tasks
- Set task priority and due dates
- Assign multiple categories to tasks
- Search and filter the task list
- Responsive UI built with Tailwind CSS and DaisyUI

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, DaisyUI, React Select
- **Backend:** Node.js, Express 5
- **Database:** SQLite via `sqlite` and `sqlite3`

## Project Structure

```text
client/   React/Vite frontend
server/   Express API and SQLite data access
```

## Requirements

- Node.js 18 or newer
- npm

## Installation

Clone the repository, then install dependencies in both applications:

```bash
cd client
npm install

cd ../server
npm install
```

## Running Locally

Start the API from the `server` directory:

```bash
npm run dev
```

The API runs at `http://localhost:3000`.

In a second terminal, start the frontend:

```bash
cd client
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

The Vite development server proxies `/api` requests to the backend at
`http://localhost:3000`.

## Database Notes

The server opens `database.db` relative to the directory from which the server
is started. The repository includes database helper scripts:

- `server/createTable.js` creates the `task_categories` join table.
- `server/seedTable.js` inserts the default categories: BCS, Coding, Academic
  study, and Personal.
- `server/alterTable.js` clears task-category relationships.

These scripts assume the required `tasks` and `categories` tables already exist.
Run database scripts from the `server` directory when needed:

```bash
node createTable.js
node seedTable.js
```

Do not run `alterTable.js` unless you intend to clear all task-category
assignments.

## API Endpoints

### Tasks

| Method   | Endpoint         | Description                    |
| -------- | ---------------- | ------------------------------ |
| `GET`    | `/api/tasks`     | List all tasks with categories |
| `GET`    | `/api/tasks/:id` | Get one task                   |
| `POST`   | `/api/tasks`     | Create a task                  |
| `PATCH`  | `/api/tasks/:id` | Update a task                  |
| `DELETE` | `/api/tasks/:id` | Delete a task                  |

### Categories

| Method | Endpoint          | Description               |
| ------ | ----------------- | ------------------------- |
| `GET`  | `/api/categories` | List available categories |

## Frontend Commands

Run these from `client/`:

```bash
npm run dev      # Start the Vite development server
npm run build    # Create a production build
npm run preview  # Preview the production build
npm run lint     # Run ESLint
```

## Backend Commands

Run these from `server/`:

```bash
npm start        # Start the API
npm run dev      # Start the API with Nodemon
```
