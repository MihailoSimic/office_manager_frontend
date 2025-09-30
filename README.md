# Office Manager Frontend

## Pokretanje lokalno

1. Instaliraj Node.js 20+ i npm.  
2. Instaliraj zavisnosti:
   ```bash
   npm install
   ```
3. Pokreni aplikaciju:
   ```bash
   npm run dev
   ```
   Frontend će biti dostupan na [http://localhost:5173](http://localhost:5173).

⚠️ Backend mora biti pokrenut (lokalno ili u Docker-u) i dostupan na `http://localhost:8000`.  
Ako se URL razlikuje, promeni ga u konfiguraciji frontend aplikacije (`\src\api\baseUrl.js`).
