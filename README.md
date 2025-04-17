# 🎬 MMS Backend

This is the backend API for the **Movie Management System (MMS)** built using Node.js, Express, and PostgreSQL with Prisma ORM.

---


## 📦 Tech Stack

- **Node.js**
- **Express**
- **PostgreSQL**
- **Prisma**

---



---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Chetan-Managavi/mms_backend.git
cd mms_backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory and add the following:

```env
DATABASE_URL="postgresql://username:password@hostname:port/mms_db?schema=public"
PORT=3000
JWT_SECRET="your jwt secret"
```

> Replace values as needed for your environment.

### 4. Set up the database

Make sure PostgreSQL is running and a database named `mms_db` exists.

Then run Prisma migrations:

```bash
npx prisma migrate dev --name init
```

Generate Prisma client:

```bash
npx prisma generate
```

---

## ▶️ Run the Application

### For development:

```bash
npm run dev
```

## 🚀 Deploy to SAP BTP (Cloud Foundry)

### 1. Prerequisites

- SAP BTP CLI (`cf`) installed and logged in
- PostgreSQL and logging service instances created:
  ```bash
  cf create-service postgresql <plan> postgres_db
  cf create-service application-logging <plan> mms_logger
  ```

### 2. Deploy the App

```bash
cf push
```

This uses the provided `manifest.yml`:

```yaml
---
applications:
- name: mms_backend
  random-route: true
  path: /
  memory: 256M
  buildpacks:
  - nodejs_buildpack
  services:
  - postgres_db
  - mms_logger
```

SAP BTP will automatically inject service credentials into your app via environment variables.

> Make sure your app reads `process.env.DATABASE_URL` and other config from the environment in production.

---

---
