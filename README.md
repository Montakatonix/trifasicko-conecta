# Trifasicko Conecta

Trifasicko Conecta es una plataforma web que ayuda a los usuarios a encontrar las mejores tarifas de luz e internet. Compara ofertas de diferentes compañías y proporciona recomendaciones personalizadas basadas en el consumo y las necesidades específicas de cada usuario.

## Características principales

- **Comparador de luz**: Analiza tarifas de las principales comercializadoras eléctricas
- **Comparador de internet**: Compara ofertas de fibra, ADSL y tarifas móviles
- **Calculadora de ahorro**: Estima el ahorro potencial al cambiar de tarifa
- **Interfaz intuitiva**: Diseño moderno y fácil de usar
- **Resultados personalizados**: Recomendaciones basadas en el perfil de consumo
- **Sin costes**: Servicio completamente gratuito

## Tecnologías utilizadas

- [Next.js 14](https://nextjs.org/)
- [React 18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

## Requisitos previos

- Node.js 18.0.0 o superior
- npm 8.0.0 o superior

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/trifasicko-conecta.git
   ```

2. Instala las dependencias:
   ```bash
   cd trifasicko-conecta
   npm install
   ```

3. Crea un archivo `.env.local` con las variables de entorno necesarias:
   ```
   NEXT_PUBLIC_API_URL=tu_url_api
   ```

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm run start`: Inicia el servidor de producción
- `npm run lint`: Ejecuta el linter

## Estructura del proyecto

```
trifasicko-conecta/
├── app/                    # Páginas y rutas de la aplicación
├── components/            # Componentes reutilizables
│   ├── ui/               # Componentes de interfaz de usuario
│   └── ...               # Otros componentes
├── lib/                  # Utilidades y tipos
├── public/              # Archivos estáticos
└── ...
```

## Contribuir

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Haz push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## Contacto

Si tienes alguna pregunta o sugerencia, no dudes en contactarnos:

- Email: info@trifasickoconecta.es
- Teléfono: 900 123 456
- Web: [https://trifasickoconecta.es](https://trifasickoconecta.es)
