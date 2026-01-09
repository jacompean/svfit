# SVFIT Frontend (V2)

- React + Vite + Tailwind
- Login por ID (ej. SV0001) y password
- Admin global: panel para crear gimnasios (tenants) y configurar dominios
- Menú por rol

## Variables de entorno (Vercel)

- `VITE_API_BASE_URL` = `https://svfit-backend.vercel.app`

## Nota importante

El backend V2 resuelve tenant por `Origin` y solo permite dominios registrados para cada gimnasio.
Si abres el frontend desde un dominio nuevo, el login mostrará “Dominio no autorizado” hasta que el admin global lo agregue.
