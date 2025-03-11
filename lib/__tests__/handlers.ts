import { mockApiResponses } from '@/lib/__mocks__/test-data'

export const setupFetchMocks = () => {
  // Mock para la API de energía
  jest.spyOn(global, 'fetch').mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url

    if (url.includes('api.esios.ree.es/indicators/1001')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponses.energyPrices),
      } as Response)
    }

    // Mock para la API de telecomunicaciones
    if (url.includes('api.cnmc.es/telecoms/speeds')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponses.telecomSpeeds),
      } as Response)
    }

    // Mock para la API de seguridad
    if (url.includes('api.adt.es/coverage')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponses.securityCoverage),
      } as Response)
    }

    // Mock para productos ADT
    if (url.includes('api.adt.es/products')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponses.adtProducts),
      } as Response)
    }

    // Mock para productos Securitas
    if (url.includes('api.securitas.es/products')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponses.securitasProducts),
      } as Response)
    }

    // Fallback para peticiones no manejadas
    return Promise.resolve({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Not Found' }),
    } as Response)
  })
}

export const clearFetchMocks = () => {
  jest.restoreAllMocks()
}

// Tests
describe('API Handlers', () => {
  beforeEach(() => {
    setupFetchMocks()
  })

  afterEach(() => {
    clearFetchMocks()
  })

  describe('Energy API', () => {
    it('returns mock energy prices data', async () => {
      const response = await fetch('https://api.esios.ree.es/indicators/1001')
      const data = await response.json()
      expect(data).toEqual(mockApiResponses.energyPrices)
    })
  })

  describe('Telecom API', () => {
    it('returns mock telecom speeds data', async () => {
      const response = await fetch('https://api.cnmc.es/telecoms/speeds')
      const data = await response.json()
      expect(data).toEqual(mockApiResponses.telecomSpeeds)
    })
  })

  describe('Security API', () => {
    it('returns mock security coverage data', async () => {
      const response = await fetch('https://api.adt.es/coverage')
      const data = await response.json()
      expect(data).toEqual(mockApiResponses.securityCoverage)
    })

    it('returns mock ADT products data', async () => {
      const response = await fetch('https://api.adt.es/products')
      const data = await response.json()
      expect(data).toEqual(mockApiResponses.adtProducts)
    })

    it('returns mock Securitas products data', async () => {
      const response = await fetch('https://api.securitas.es/products')
      const data = await response.json()
      expect(data).toEqual(mockApiResponses.securitasProducts)
    })
  })

  describe('Error handling', () => {
    it('returns 404 for unhandled routes', async () => {
      const response = await fetch('https://api.unknown.com/endpoint')
      expect(response.ok).toBe(false)
      expect(response.status).toBe(404)
      const data = await response.json()
      expect(data).toEqual({ error: 'Not Found' })
    })
  })
}) 