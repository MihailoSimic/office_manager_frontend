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
