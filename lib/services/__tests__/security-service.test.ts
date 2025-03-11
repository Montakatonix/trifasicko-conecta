import { checkSecurityCoverage, fetchSecuritySystems } from '../security-service'
import { setupFetchMocks, clearFetchMocks } from '../../__tests__/handlers'

describe('Security Service', () => {
  const mockPostalCode = '28001'

  beforeEach(() => {
    setupFetchMocks()
  })

  afterEach(() => {
    clearFetchMocks()
  })

  describe('checkSecurityCoverage', () => {
    it('should check security coverage successfully', async () => {
      const coverage = await checkSecurityCoverage(mockPostalCode)

      expect(coverage).toEqual({
        available: true,
        installers: expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            phone: expect.any(String),
            distance: expect.any(Number),
          }),
        ]),
        estimatedInstallationTime: expect.any(String),
      })
    })

    it('should handle API errors gracefully', async () => {
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'))

      const coverage = await checkSecurityCoverage(mockPostalCode)

      expect(coverage).toEqual({
        available: false,
        installers: [],
        estimatedInstallationTime: '3-5 días hábiles',
      })
    })

    it('should handle missing installers data', async () => {
      jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              available: true,
              estimatedTime: '2-3 días',
            }),
        } as Response)
      )

      const coverage = await checkSecurityCoverage(mockPostalCode)

      expect(coverage.installers).toEqual([])
      expect(coverage.available).toBe(true)
    })
  })

  describe('fetchSecuritySystems', () => {
    it('should fetch security systems successfully', async () => {
      const systems = await fetchSecuritySystems()

      expect(systems).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            nombre: expect.any(String),
            proveedor: expect.any(String),
            tipo: expect.stringMatching(/^(alarma|camara|kit|sensor)$/),
            precio: expect.any(Number),
            precioInstalacion: expect.any(Number),
            cuotaMensual: expect.any(Number),
            caracteristicas: expect.any(Array),
            especificaciones: expect.objectContaining({
              conectividad: expect.any(Array),
              alimentacion: expect.any(String),
              sensores: expect.any(Array),
            }),
            compatibilidad: expect.any(Array),
            garantia: expect.any(Number),
            urlContratacion: expect.any(String),
            imagenes: expect.any(Array),
          }),
        ])
      )
    })

    it('should return default systems on API error', async () => {
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('API Error'))

      const systems = await fetchSecuritySystems()

      expect(systems).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: '1',
            nombre: 'Kit Básico ADT',
            proveedor: 'ADT',
          }),
        ])
      )
    })

    it('should transform ADT products correctly', async () => {
      jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
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
              },
            ]),
        } as Response)
      )

      const systems = await fetchSecuritySystems()
      const testSystem = systems.find(s => s.id === 'test-id')

      expect(testSystem).toEqual(
        expect.objectContaining({
          id: 'test-id',
          nombre: 'Test Product',
          tipo: 'alarma',
          precio: 299.99,
          precioInstalacion: 99.99,
          cuotaMensual: 29.99,
          caracteristicas: ['Feature 1', 'Feature 2'],
          especificaciones: {
            conectividad: ['WiFi', '4G'],
            alimentacion: 'Battery',
            sensores: ['Motion', 'Door'],
          },
          compatibilidad: ['Alexa'],
          garantia: 24,
          urlContratacion: 'https://test.com',
          imagenes: ['image1.jpg'],
        })
      )
    })
  })
}) 