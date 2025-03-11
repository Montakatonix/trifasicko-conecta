// Mock user data
export const mockUser = {
  id: 'test-user-1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  createdAt: '2024-01-01T00:00:00Z',
}

// Mock security systems data
export const mockSecuritySystems = [
  {
    id: 'system-1',
    nombre: 'Kit Profesional ADT',
    proveedor: 'ADT',
    tipo: 'alarma',
    precio: 399.99,
    precioInstalacion: 149.99,
    cuotaMensual: 39.99,
    caracteristicas: [
      'Detección de movimiento avanzada',
      'Conectividad 4G',
      'Batería de respaldo',
    ],
    especificaciones: {
      conectividad: ['WiFi', '4G', 'Ethernet'],
      alimentacion: 'Red eléctrica con batería de respaldo',
      sensores: ['Movimiento', 'Puerta/Ventana', 'Rotura de cristal'],
    },
    compatibilidad: ['Alexa', 'Google Assistant', 'Apple HomeKit'],
    garantia: 24,
    urlContratacion: 'https://adt.es/contratar/kit-profesional',
    imagenes: ['kit-pro-1.jpg', 'kit-pro-2.jpg'],
  },
]

// Mock energy news data
export const mockEnergyNews = [
  {
    title: 'Precio de la energía alcanza nuevo mínimo',
    description: 'El precio de la energía registró un nuevo mínimo histórico...',
    url: 'https://www.esios.ree.es/es/noticias/precio-energia-minimo',
    publishedAt: '2024-01-20T12:00:00Z',
    source: 'ESIOS',
    category: 'energia',
  },
]

// Mock telecom news data
export const mockTelecomNews = [
  {
    title: 'Mejora en la velocidad de Internet en Madrid',
    description: 'La velocidad media de Internet en Madrid aumenta un 25%...',
    url: 'https://www.cnmc.es/noticias/mejora-velocidad-internet-madrid',
    publishedAt: '2024-01-20T10:00:00Z',
    source: 'CNMC',
    category: 'telefonia',
  },
]

// Mock API responses
export const mockApiResponses = {
  securityCoverage: {
    available: true,
    installers: [
      {
        name: 'Instalador Profesional',
        phone: '123456789',
        distance: 5,
      },
    ],
    estimatedTime: '3-5 días',
  },
  adtProducts: [
    {
      id: 'test-id',
      name: 'Test Product',
      type: 'alarm',
      price: 299.99,
      installationFee: 99.99,
      monthlyFee: 29.99,
      features: ['Feature 1', 'Feature 2'],
      connectivity: ['WiFi', '4G'],
      powerSupply: 'Battery',
      sensors: ['Motion', 'Door'],
      compatibility: ['Alexa'],
      purchaseUrl: 'https://test.com',
      images: ['image1.jpg'],
      warranty: 24,
    }
  ],
  securitasProducts: [],
  energyPrices: {
    success: true,
    data: [
      {
        price: 0.15,
        timestamp: '2024-01-20T12:00:00Z',
        unit: '€/MWh',
        market: 'SPOT',
      },
    ],
  },
  telecomSpeeds: {
    success: true,
    data: [
      {
        speed: 100,
        region: 'Madrid',
        technology: 'Fibra',
        operator: 'Movistar',
        date: '2024-01-20',
      },
    ],
  },
} 