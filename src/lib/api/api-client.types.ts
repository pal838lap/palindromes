// Type definitions for the API client
// This file contains all type definitions and endpoint configurations

// Define the API endpoints structure with both runtime and type information
export const API_ENDPOINTS = {
  // Add endpoints here as you create them
  // users: {
  //   profile: {
  //     method: 'GET' as const,
  //     path: '/api/users/profile' as const,
  //     response: {} as UserProfile
  //   }
  // }
  palindromes: {
    getById: {
      method: 'GET' as const,
      path: (id: string) => `/api/palindromes/${id}` as const,
      response: {} as import('./api.types').Palindrome,
    }
  }
} as const

// Extract the type from the const object
export type ApiEndpoints = typeof API_ENDPOINTS

// Generic API error type
export type ApiError = {
  error: string
  status?: number
}



