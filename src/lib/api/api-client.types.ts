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
    list: {
      method: 'GET' as const,
      path: '/api/palindromes' as const,
      response: {} as import('./api.types').Palindrome[],
    },
    getById: {
      method: 'GET' as const,
      path: (id: string) => `/api/palindromes/${id}` as const,
      response: {} as import('./api.types').Palindrome,
    },
    assignUser: {
      method: 'PATCH' as const,
      path: (id: string) => `/api/palindromes/${id}` as const,
      // Accepts { userProfileId: string | null }
      body: {} as { userProfileId: string | null },
      response: {} as import('./api.types').Palindrome,
    },
    updatePicture: {
      method: 'POST' as const,
      path: (id: string) => `/api/palindromes/${id}/picture` as const,
      // multipart/form-data upload, response returns partial { id, picture }
      response: {} as { id: string; picture: string },
    },
    removePicture: {
      method: 'DELETE' as const,
      path: (id: string) => `/api/palindromes/${id}/picture` as const,
      response: {} as { id: string; picture: null },
    }
  },
  userProfiles: {
    list: {
      method: 'GET' as const,
      path: '/api/user-profiles' as const,
      response: {} as import('./api.types').UserProfile[],
    },
    create: {
      method: 'POST' as const,
      path: '/api/user-profiles' as const,
      body: {} as { name: string; avatar?: string | null },
      response: {} as import('./api.types').UserProfile,
    }
  },
  leaderboard: {
    list: {
      method: 'GET' as const,
      path: '/api/leaderboard' as const,
      response: {} as import('./api.types').LeaderboardRow[],
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



