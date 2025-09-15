// Type-safe API client for frontend requests
// This client handles HTTP requests to our Next.js API routes

import { API_ENDPOINTS, ApiError } from './api-client.types'
import { DashboardStats } from './api.types'

// Type-safe API client class
export class ApiClient {
  private baseUrl: string

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl
  }

  // Generic request method with full type safety
  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        error: response.statusText,
        status: response.status,
      }))
      
      throw new Error(errorData.error || `Request failed: ${response.statusText}`)
    }

    return response.json()
  }

  // Stats endpoints
  stats = {
    getDashboard: () => 
      this.request<DashboardStats>(
        API_ENDPOINTS.stats.dashboard.path
      ),
  }

  // Add more endpoint groups here
  // users = {
  //   getProfile: () => 
  //     this.request<ApiEndpoints['users']['profile']['response']>(
  //       '/api/users/profile'
  //     ),
  // }
}

// Export singleton instance
export const apiClient = new ApiClient()
