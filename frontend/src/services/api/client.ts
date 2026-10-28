/**
 * Simulated API client for UniRaah.
 * Encapsulates simulated async network delays and provides standard response structures
 * to make swapping with live Axios/Fetch REST endpoints straightforward in later phases.
 */

export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

export const API_DELAY_MS = 250 // Fast and responsive while exercising async TanStack Query lifecycles

export async function simulateNetworkCall<T>(data: T, delayMs: number = API_DELAY_MS): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data,
        status: 200,
        message: 'Success',
      })
    }, delayMs)
  })
}
