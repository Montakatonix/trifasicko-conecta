import { fetchEnergyNews, fetchTelecomNews, syncNewsToFirestore } from '../news-service'
import { getFirestore, collection, writeBatch, doc } from 'firebase/firestore'
import { mockFirebase } from '../../__mocks__/firebase'
import { setupFetchMocks, clearFetchMocks } from '../../__tests__/handlers'
import { mockConsoleError } from '../../__tests__/test-utils'
import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'
import type { Firestore } from '@firebase/firestore'

// Mock Firebase
jest.mock('../../firebase', () => ({
  getInitializedDb: jest.fn().mockImplementation(() => mockFirebase.db),
}))

// Mock Firestore
jest.mock('firebase/firestore', () => {
  const mockBatch = {
    set: jest.fn(),
    commit: jest.fn().mockResolvedValue(undefined),
  }

  return {
    getFirestore: jest.fn(),
    collection: jest.fn(() => 'noticias-collection'),
    doc: jest.fn(() => 'doc-ref'),
    writeBatch: jest.fn(() => mockBatch),
  }
})

const server = setupServer()

describe('News Service', () => {
  beforeAll(() => {
    mockConsoleError()
    server.listen()
  })

  afterAll(() => {
    server.close()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  describe('fetchEnergyNews', () => {
    it('should fetch energy news successfully', async () => {
      const news = await fetchEnergyNews()
      expect(news).toHaveLength(2)
      expect(news[0]).toHaveProperty('title')
      expect(news[0]).toHaveProperty('description')
      expect(news[0]).toHaveProperty('url')
    })

    it('should handle errors and return empty array', async () => {
      server.use(
        http.get('*/energy-news', () => {
          return HttpResponse.json(null, { status: 500 })
        })
      )
      const news = await fetchEnergyNews()
      expect(news).toEqual([])
    })
  })

  describe('fetchTelecomNews', () => {
    it('should fetch telecom news successfully', async () => {
      const news = await fetchTelecomNews()
      expect(news).toHaveLength(2)
      expect(news[0]).toHaveProperty('title')
      expect(news[0]).toHaveProperty('description')
      expect(news[0]).toHaveProperty('url')
    })

    it('should handle errors and return empty array', async () => {
      server.use(
        http.get('*/telecom-news', () => {
          return HttpResponse.json(null, { status: 500 })
        })
      )
      const news = await fetchTelecomNews()
      expect(news).toEqual([])
    })
  })

  describe('syncNewsToFirestore', () => {
    const mockNews = [
      {
        title: 'Test News',
        description: 'Test Description',
        url: 'https://test.com',
      },
    ]

    it('should sync news to Firestore successfully', async () => {
      const mockDb = {
        collection: jest.fn(() => ({
          doc: jest.fn(() => ({
            set: jest.fn().mockResolvedValue(undefined),
          })),
        })),
      } as unknown as Firestore

      await expect(syncNewsToFirestore(mockDb)).resolves.not.toThrow()
    })

    it('should handle errors during sync', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error')
      const mockDb = {
        collection: jest.fn(() => ({
          doc: jest.fn(() => ({
            set: jest.fn().mockRejectedValue(new Error('Firestore error')),
          })),
        })),
      } as unknown as Firestore

      await syncNewsToFirestore(mockDb)
      expect(consoleErrorSpy).toHaveBeenCalled()
    })
  })
}) 