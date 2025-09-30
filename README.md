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
   Frontend će biti dostupan na [http://localhost:4200](http://localhost:4200).

⚠️ Backend mora biti pokrenut (lokalno ili u Docker-u) i dostupan na `http://localhost:8000`.  
Ako se URL razlikuje, promeni ga u konfiguraciji frontend aplikacije (obično u `environment.ts` ili `.env` fajlu).
