# Branch International Backend

This is the backend service for **Branch International**, built with **Node.js**, **Express**, and **Supabase**.

---

## 🚀 Getting Started

Follow the steps below to set up and run the project locally.

### 1. Clone the Repository
```bash
git pull https://github.com/vikashmishra464/branchInternational
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory and add the following environment variables:

```env
SUPABASE_URL=https://bzdmexfyhxyirrytstqu.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ6ZG1leGZ5aHh5aXJyeXRzdHF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTU3NDk2MCwiZXhwIjoyMDc3MTUwOTYwfQ.4PT5hnKJ53my7-xiDkGjggAs5lVYBTQNhGbGobpe9Ds
PORT=8080
```

> ⚠️ **Note:** Keep your `.env` file private and never commit it to GitHub.

---

### 4. Start the Server

You can start the server using one of the following commands:

#### Using Node:
```bash
node server.js
```

#### Using Nodemon (for development):
```bash
nodemon start
```

---

## 🧩 Project Structure

```
branchInternational/
│
├── src/              # Source code (controllers, services, routes, etc.)
├── package.json
├── .env.example
├── server.js
└── README.md
```

---

## 🧠 Tech Stack

- **Node.js**
- **Express.js**
- **Supabase**
- **PostgreSQL**
- **Nodemon (for development)**

---

## 📬 API Endpoints

| Method | Endpoint | Description |
|--------|-----------|--------------|
| GET | `/api/...` | Fetch data |
| POST | `/api/...` | Create data |
| PUT | `/api/...` | Update data |
| DELETE | `/api/...` | Delete data |

### 🔍 Example API Routes

| Type | Endpoint | Description |
|------|-----------|-------------|
| Agent | [http://localhost:8080/api/agent/getAgentHtml](http://localhost:8080/api/agent/getAgentHtml) | Get Agent HTML view |
| Customer | [http://localhost:8080/api/customer/getCustomerHtml](http://localhost:8080/api/customer/getCustomerHtml) | Get Customer HTML view |

---

## 🗃️ Example Database Schema

```sql
CREATE TABLE branchInternational.customer_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'working', 'closed')),
    urgency_score INT DEFAULT 0,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🧾 License

This project is licensed under the **MIT License**.
