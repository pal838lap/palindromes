// Type definitions for the API client
// This file contains all type definitions and endpoint configurations

import { DashboardStats } from './api.types'

// Define the API endpoints structure with both runtime and type information
export const API_ENDPOINTS = {
  stats: {
    dashboard: {
      method: 'GET' as const,
      path: '/api/stats' as const,
      response: {} as DashboardStats
    }
  }
  // Add more endpoints here as you create them
  // users: {
  //   profile: {
  //     method: 'GET' as const,
  //     path: '/api/users/profile' as const,
  //     response: {} as UserProfile
  //   }
  // }
} as const

// Extract the type from the const object
export type ApiEndpoints = typeof API_ENDPOINTS

// Generic API error type
export type ApiError = {
  error: string
  status?: number
}



