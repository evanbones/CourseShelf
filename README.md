# CourseShelf

CourseShelf is a streamlined web application designed for instructors to seamlessly manage their course lists and associated learning materials.

## Approach

CourseShelf is built using a modern, unified full-stack approach via React Router. By leveraging React Router's loaders and actions, the application handles both server-side data fetching and client-side UI rendering within the same route files, eliminating the need for a separate REST API. State mutations and form submissions are handled natively by the framework. For data persistence, Prisma ORM provides a deeply integrated, type-safe interface to a PostgreSQL database, while Tailwind CSS is used to deliver a clean, responsive, and functional user interface without the overhead of heavy component libraries.

## System Architecture

* **Frontend / UI:** React, styled with Tailwind CSS, running within React Router's unified architecture.
* **Backend / API:** Server-side loaders and actions (Node.js) provided by React Router.
* **Database:** PostgreSQL database, managed and queried using Prisma ORM with the `pg` adapter.
* **Testing:** Vitest for unit and integration testing; Playwright for end-to-end testing.
* **Containerization:** Dockerized backend/database environment using Docker Compose.

## Setup Instructions

### Prerequisites
* Node.js (v18 or higher recommended)
* Docker and Docker Compose
* npm (or your preferred package manager)

---

### Runing via Docker (Recommended)

This is the easiest way to run the application. The database and the web server are fully containerized, and the database schema will initialize automatically.

1. **Start the stack:**
   ```bash
   docker compose up -d --build
   ```

2. **Access the app:**
   Open your browser and navigate to `http://localhost:3000`.

*(To stop the application, run `docker compose down`)*

---

### Local Development Setup

Use this method if you want to run the Vite development server locally with hot-module reloading.

**1. Environment Setup**

Clone the repository and install dependencies:
```bash
npm install
```

Create a `.env` file in the root directory and configure your PostgreSQL database URL to point to the exposed Docker port (5433):
```env
DATABASE_URL="postgresql://admin:password123@localhost:5433/courseshelf?schema=public"
```

**2. Start the Database**
Use Docker Compose to spin up the database:
```bash
docker compose up -d db
```

**3. Initialize the Database Schema**
Run Prisma to push the schema to your local database and generate the Prisma Client:
```bash
npx prisma db push
npx prisma generate
```

**4. Run the Application**
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## Running Tests
**Unit & Integration Tests (Vitest):**
```bash
npm run test
```

**End-to-End Tests (Playwright):**
```bash
npx playwright install # Only needed the first time
npx playwright test
```