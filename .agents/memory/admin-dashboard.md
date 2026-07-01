---
name: Admin dashboard
description: Portfolio admin panel setup and credentials
---

Admin dashboard is at /admin on the portfolio web app.

- Default password: admin1234
- Can override via ADMIN_PASSWORD environment variable on the API server
- Authentication works by attempting a PUT to /api/portfolio/contact with the password header; 401 = wrong password
- Session stored in sessionStorage (cleared on browser close)
- Data stored in artifacts/api-server/data/portfolio.json (persisted on the server filesystem)
- Vite dev proxy: /api → http://localhost:8080 (removes /api prefix before forwarding)
- All portfolio components (Projects, Skill, About, Contact) fetch from API on mount with hardcoded fallback if API unavailable
