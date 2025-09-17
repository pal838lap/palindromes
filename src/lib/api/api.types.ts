// API response and request types
// This file contains all the data types returned from API endpoints

// Add API types here as you create them
export type Palindrome = {
	id: string
	userProfileId?: string | null
	userProfileName?: string | null
	picture?: string | null
	brandId?: string | null
	brandName?: string | null
	year?: number | null
	categoryId?: string | null
	model?: string | null
	color?: string | null
	foundAt?: string | null
	createdAt: string
	updatedAt: string
}

export type UserProfile = {
	id: string
	name: string
	avatar?: string | null
	createdAt: string
	updatedAt: string
}

// Leaderboard row returned from /api/leaderboard
export type LeaderboardRow = {
  rank: number
  userProfileId: string
  name: string
  avatar: string | null
  count: number
}
// export type UserProfile = {
//   id: string
//   name: string
//   email: string
// }

// export type CreatePostRequest = {
//   title: string
//   content: string
// }

// export type Post = {
//   id: string
//   title: string
//   content: string
//   createdAt: string
// }
