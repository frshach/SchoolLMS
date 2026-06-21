# School LMS — Local Setup Guide

This project now uses **MongoDB** instead of MySQL. Everything is pre-configured
to run against a **local** MongoDB server out of the box — no password needed.

## 1. Install MongoDB locally (one-time)

Download MongoDB Community Server: https://www.mongodb.com/try/download/community
Install it with the default options (it installs as a Windows Service by default).

## 2. Start the MongoDB server

If it installed as a Windows Service, it's likely already running. Check with:

```powershell
Get-Service -Name MongoDB
```

If it shows "Running", you're done — skip to step 3.

If not running, or you installed manually, start it yourself in a terminal:

```powershell
mongod --dbpath "C:\data\db"
```

(Create the `C:\data\db` folder first if it doesn't exist — `mkdir C:\data\db`)
Leave this terminal window open while you work; it IS the database server.

## 3. Backend config (already done for you)

`backend/.env` already contains:
```
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=schoollms
```
No password is needed for a default local MongoDB install. You don't need to
change anything here for local development. The `schoollms` database and all
its collections are created automatically the first time data is written
(e.g. the first time you register a user).

**Important:** Spring Boot does not read `.env` files by itself. Either:
- Set these two as real Windows environment variables, OR
- Just run the app — the code in `DBConnection.java` already **defaults to
  these exact values** if the environment variables aren't set, so it will
  work locally without any extra setup.

## 4. Run the backend

```powershell
cd C:\S75523\school-lms\backend
mvn clean install
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`.

## 5. Run the frontend

```powershell
cd C:\S75523\school-lms\frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000` and talks to the backend at
`http://localhost:8080/api` (already configured in `frontend/src/api/api.js`).

## 6. Verify it's working

Register a new account on the site, then open another terminal and run:

```powershell
mongosh
use schoollms
db.users.find()
```

You should see your new user document. If you see it, the connection is
working correctly end-to-end.

## Moving to the cloud later (e.g. MongoDB Atlas)

When you're ready to deploy, just change the two values in `backend/.env`
(or set them as environment variables on your cloud host):
```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority
MONGO_DB_NAME=schoollms
```
Nothing else in the code needs to change.
