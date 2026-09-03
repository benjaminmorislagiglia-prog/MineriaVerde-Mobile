# Frontend React - Mineria Verde

Primera migracion del frontend viejo a React con Vite.

## Comandos

```bash
npm install
npm run dev
```

La app queda disponible normalmente en `http://127.0.0.1:5173`.

## Estado actual

- Mantiene los endpoints existentes de la API en `https://localhost:44320/api`.
- El login es local para el usuario de la empresa: `benjamin` / `1234`.
- Reemplaza el HTML dinamico manual por componentes React.
- Agrega layout de sistema interno, dashboard, sidebar, formularios, tablas, busqueda y acciones CRUD.
- El codigo viejo quedo como respaldo en `src/legacy/script.js` y `src/legacy/style.css`.
- `index.html` queda en la raiz porque Vite lo usa como entrada de la aplicacion.

Cuando se redisenen backend y base de datos, el siguiente paso natural es cambiar los formularios con IDs manuales por selects alimentados desde la API.
