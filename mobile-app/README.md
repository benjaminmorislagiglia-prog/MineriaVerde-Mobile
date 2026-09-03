# Mineria Verde Mobile

Aplicacion movil para Laboratorio 2 creada con React Native + Expo.

## Comandos principales

```bash
npm start
npm run android
```

Con `npm start`, Expo muestra un QR para abrir la app con Expo Go desde Android.

## Credenciales de prueba

- Usuario: `benjamin`
- Contrasena: `1234`

## Estructura

```txt
src/
├── components/      # Componentes reutilizables
├── data/            # Datos temporales del MVP
├── navigation/      # Navegacion entre pantallas
├── screens/         # Pantallas principales
├── services/        # Cliente de API REST
└── theme/           # Colores y estilo base
```

## API

El archivo `src/services/api.js` centraliza la URL base de la API ASP.NET.

En emulador Android se puede usar `http://10.0.2.2:51941/api`.
En un celular real se debe usar la IP local de la PC, por ejemplo `http://192.168.0.10:51941/api`.
