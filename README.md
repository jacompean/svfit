# SVFIT Frontend (Vite + React)

SPA para administración del gimnasio SVFIT.

## Variables de entorno (Vercel)
- `VITE_API_BASE_URL` (URL del backend, por ejemplo `https://svfit-backend.vercel.app`)

## Dev local (opcional)
```bash
npm install
cp .env.example .env
npm run dev
```

## Deploy en Vercel
- Framework: Vite
- Build command: `npm run build`
- Output: `dist`
- `vercel.json` incluye rewrite para que React Router funcione.
