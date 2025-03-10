# Trifasicko Conecta

Plataforma web para la comparación de tarifas de luz e internet, desarrollada con Next.js y Firebase.

## Características

- Comparador de tarifas de luz
- Comparador de tarifas de internet
- Calculadora de ahorro energético
- Sistema de autenticación de usuarios
- Panel de perfil personalizado
- Notificaciones en tiempo real
- Blog de noticias y actualizaciones
- Sección de reseñas y testimonios

## Tecnologías

- Next.js 15.1.0
- React 19
- Firebase (Auth, Firestore)
- TypeScript
- Tailwind CSS
- Radix UI Components
- ESLint
- Prettier

## Requisitos

- Node.js >= 18.0.0
- npm >= 9.0.0

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tu-usuario/trifasicko-conecta.git
cd trifasicko-conecta
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
Crear un archivo `.env.local` con las siguientes variables:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

## Despliegue

El proyecto está configurado para ser desplegado en Vercel. Solo necesitas:

1. Conectar el repositorio con Vercel
2. Configurar las variables de entorno en el dashboard de Vercel
3. Desplegar

## Estructura del Proyecto

```
├── app/                 # Rutas y páginas de la aplicación
├── components/         # Componentes reutilizables
├── lib/               # Utilidades y configuraciones
├── public/            # Archivos estáticos
├── styles/            # Estilos globales
└── types/             # Definiciones de tipos TypeScript
```

## Contribuir

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles. 