// Type-safe API client for frontend requests
// This client handles HTTP requests to our Next.js API routes

import { ApiError, API_ENDPOINTS } from './api-client.types'

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

  // Add endpoint groups here as you create them
  // users = {
  //   getProfile: () => 
  //     this.request<ApiEndpoints['users']['profile']['response']>(
  //       '/api/users/profile'
  //     ),
  // }
  get palindromes() {
    return {
      getById: (id: string) =>
        this.request<typeof API_ENDPOINTS.palindromes.getById.response>(
          API_ENDPOINTS.palindromes.getById.path(id)
        ),
      assignUser: (id: string, userProfileId: string | null) =>
        this.request<typeof API_ENDPOINTS.palindromes.assignUser.response>(
          API_ENDPOINTS.palindromes.assignUser.path(id),
          {
            method: API_ENDPOINTS.palindromes.assignUser.method,
            body: JSON.stringify({ userProfileId }),
          }
        ),
      updatePicture: async (id: string, file: File) => {
        const endpoint = API_ENDPOINTS.palindromes.updatePicture
        const form = new FormData()
        form.append('file', file)
        const res = await fetch(endpoint.path(id), {
          method: endpoint.method,
          body: form,
        })
        if (!res.ok) {
          let error: ApiError
          try { error = await res.json() } catch { error = { error: 'Upload failed', status: res.status } }
          throw error
        }
        return res.json() as Promise<{ id: string; picture: string }>
      },
      removePicture: (id: string) => {
        const endpoint = API_ENDPOINTS.palindromes.removePicture
        return this.request<typeof API_ENDPOINTS.palindromes.removePicture.response>(
          endpoint.path(id),
          { method: endpoint.method }
        )
      }
    }
  }

  userProfiles = {
    list: () =>
      this.request<typeof API_ENDPOINTS.userProfiles.list.response>(
        API_ENDPOINTS.userProfiles.list.path
      ),
    create: (name: string, avatar?: string | null) =>
      this.request<typeof API_ENDPOINTS.userProfiles.create.response>(
        API_ENDPOINTS.userProfiles.create.path,
        {
          method: API_ENDPOINTS.userProfiles.create.method,
          body: JSON.stringify({ name, avatar })
        }
      ),
  }
}

// Export singleton instance
export const apiClient = new ApiClient()
