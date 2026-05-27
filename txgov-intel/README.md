# Texas IT Intelligence — Signature Advisory Partners

Password-protected React app tracking Texas state agency IT budgets, SB1/HB500 legislative funding, and live Comptroller spend data.

## Features
- **Agency Table** — IT budgets, initiatives, technology area tags with modal synopses
- **SB1 & HB500** — All riders, exceptional items, and supplemental appropriations by agency
- **Live Spend** — Real-time data from Texas Open Data Portal (data.texas.gov)
- **Password protection** — Session-based auth, configurable via environment variable

## Deploy to Vercel (recommended)

### 1. Push to GitHub
```bash
cd txgov-intel
git init
git add  .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/txgov-intel.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repo
3. Framework preset: **Create React App**
4. Add environment variable: `REACT_APP_PASSWORD` = your chosen password
5. Click Deploy

### 3. Change the password
In Vercel dashboard → Project → Settings → Environment Variables:
- Set `REACT_APP_PASSWORD` to any password you want
- Redeploy for it to take effect

## Local Development
```bash
cp .env.example .env.local
npm install
npm start
```

## Updating Data
All agency data, SB1 riders, and HB500 items live in:
`src/data/agencies.js`

Update this file each legislative session with new appropriations, riders, and exceptional items.

## Data Sources
- Texas Comptroller Payments to Payee Dashboard (FY25 actuals)
- SB1 89th Legislature — General Appropriations Act 2026-27
- HB500 — Supplemental Appropriations (enacted June 22, 2025)
- DIR FY2025-2029 Agency Strategic Plan
- LBB Fiscal Size-Up 2026-27
- Industry Insider Texas

---
© 2026 Signature Advisory Partners LLC. Confidential.
