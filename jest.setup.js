import "@testing-library/jest-dom"

// Simple polyfills for Node.js environment
if (!global.TextEncoder) {
  const { TextEncoder, TextDecoder } = require("util")
  global.TextEncoder = TextEncoder
  global.TextDecoder = TextDecoder
}

if (!global.ReadableStream) {
  try {
    const {
      ReadableStream,
      WritableStream,
      TransformStream,
    } = require("stream/web")
    global.ReadableStream = ReadableStream
    global.WritableStream = WritableStream
    global.TransformStream = TransformStream
  } catch {
    // Fallback if stream/web is not available
  }
}

// Mock global Response for API routes
if (!global.Response) {
  global.Response = class MockResponse {
    constructor(body, init) {
      this.body = body
      this.status = init?.status || 200
      this.statusText = init?.statusText || "OK"
      this.headers = new Map(Object.entries(init?.headers || {}))
    }

    static json(body, init) {
      const response = new MockResponse(JSON.stringify(body), init)
      response.headers.set("content-type", "application/json")
      return response
    }

    async json() {
      return JSON.parse(this.body)
    }

    async text() {
      return this.body
    }
  }
}

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} />
  },
}))

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => "/",
}))

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null
  }
  disconnect() {
    return null
  }
  unobserve() {
    return null
  }
}

// Suppress console errors during tests unless explicitly testing error scenarios
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Warning: ReactDOM.render is no longer supported")
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
