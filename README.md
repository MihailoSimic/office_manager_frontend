# Office Manager Frontend

## Running Locally

1. Install Node.js 20+ and npm.  
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm run dev
   ```
   The frontend will be available at [http://localhost:5173](http://localhost:5173).

⚠️ The backend must be running (locally or in Docker) and available at `http://localhost:8000`.  
If the URL is different, change it in the frontend app configuration (`\src\api\baseUrl.js`).

## Running with Docker

1. In the root folder of the backend project, there is a `docker-compose.yml` file that starts **MongoDB**, **backend**, and **frontend**.  
2. Run:
   ```bash
   docker compose up --build
   ```
3. The backend will be available at [http://localhost:8000](http://localhost:8000).  
   MongoDB runs in a container and the backend is connected directly via `MONGO_URI=mongodb://mongo:27017/office_manager`.

The frontend will be available at [http://localhost:3000](http://localhost:3000).
