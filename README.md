# Campus Notifications

A full-stack campus notification system featuring a priority inbox algorithm and a React frontend for browsing and managing notifications.

## Project Structure

```
├── logging_middleware/         # Reusable logging module
├── notification_app_be/        # Backend — Priority Inbox (Stage 1)
├── notification_app_fe/        # React + MUI Frontend (Stage 2)
├── notification_system_design.md
├── .gitignore
└── README.md
```

## Quick Start

### 1. Install Logging Middleware

```bash
cd logging_middleware
npm install
```

### 2. Run Backend (Stage 1 — Priority Inbox)

```bash
cd notification_app_be
npm install
node index.js
```

### 3. Run Frontend (Stage 2)

```bash
cd notification_app_fe
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Priority Inbox Algorithm**: Ranks notifications by type weight (Placement > Result > Event) and recency using a Min-Heap for O(log N) efficiency.
- **All Notifications Page**: Browse all campus notifications with type-based filtering, pagination, and read/unread tracking.
- **Priority Inbox Page**: View the top N most important unread notifications, with configurable N.
- **Custom Logging**: Every operation is logged via a dedicated logging middleware that sends structured logs to a remote service.

## Tech Stack

- **Frontend**: React + Material UI
- **Backend**: Node.js
- **Logging**: Custom middleware with remote log aggregation
