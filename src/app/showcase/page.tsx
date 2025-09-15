'use client'

import { PalindromeCard, PalindromeCardCompact } from '@/components/palindrome-card'
import { SiteHeader } from '@/components/layout/site-header'
import type { PalindromeWithDetails } from '@/lib/db/schema'

// Dummy data for testing the cards
const dummyPalindromes: PalindromeWithDetails[] = [
  {
    id: 'ABCBA',
    userProfileId: 'user1',
    picture: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop',
    brandId: 'brand1',
    year: 2022,
    categoryId: 'cat1',
    model: 'Camry',
    color: 'Blue',
    foundAt: new Date('2024-03-15'),
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2024-03-15'),
    userProfile: {
      id: 'user1',
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    brand: {
      id: 'brand1',
      name: 'Toyota',
      createdAt: new Date('2024-01-01'),
    },
    category: {
      id: 'cat1',
      name: 'Classic',
      description: 'Classic vehicle palindromes',
      createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: '12321',
    userProfileId: 'user2',
    picture: null,
    brandId: 'brand2',
    year: 2020,
    categoryId: 'cat2',
    model: 'Mustang',
    color: 'Red',
    foundAt: new Date('2024-02-20'),
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-20'),
    userProfile: {
      id: 'user2',
      name: 'Sarah Johnson',
      avatar: null,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    brand: {
      id: 'brand2',
      name: 'Ford',
      createdAt: new Date('2024-01-01'),
    },
    category: {
      id: 'cat2',
      name: 'Numeric',
      description: 'Number-based palindromes',
      createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: 'RACECAR',
    userProfileId: null, // Not found yet
    picture: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop',
    brandId: null,
    year: null,
    categoryId: 'cat3',
    model: null,
    color: null,
    foundAt: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    userProfile: null,
    brand: null,
    category: {
      id: 'cat3',
      name: 'Word-based',
      description: 'Word palindromes',
      createdAt: new Date('2024-01-01'),
    },
  },
  {
    id: '54345',
    userProfileId: 'user3',
    picture: null,
    brandId: 'brand3',
    year: 2019,
    categoryId: null,
    model: 'Civic',
    color: 'White',
    foundAt: new Date('2024-04-10'),
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-10'),
    userProfile: {
      id: 'user3',
      name: 'Mike Davis',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01'),
    },
    brand: {
      id: 'brand3',
      name: 'Honda',
      createdAt: new Date('2024-01-01'),
    },
    category: null,
  },
  {
    id: 'A1B2B1A',
    userProfileId: 'user1',
    picture: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=300&fit=crop',
    brandId: 'brand4',
    year: 2023,
    categoryId: 'cat4',
    model: 'Model S',
    color: 'Black',
    foundAt: new Date('2024-05-01'),
    createdAt: new Date('2024-04-20'),
    updatedAt: new Date('2024-05-01'),
    userProfile: {
      id: 'user1',
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    brand: {
      id: 'brand4',
      name: 'Tesla',
      createdAt: new Date('2024-01-01'),
    },
    category: {
      id: 'cat4',
      name: 'Mixed',
      description: 'Mixed alphanumeric palindromes',
      createdAt: new Date('2024-01-01'),
    },
  },
]

export default function ShowcasePage() {
  const handleEdit = (palindrome: PalindromeWithDetails) => {
    console.log('Edit palindrome:', palindrome.id)
  }

  const handleDelete = (palindrome: PalindromeWithDetails) => {
    console.log('Delete palindrome:', palindrome.id)
  }

  const handleViewDetails = (palindrome: PalindromeWithDetails) => {
    console.log('View details for palindrome:', palindrome.id)
  }

  const handleCardClick = (palindrome: PalindromeWithDetails) => {
    console.log('Clicked on palindrome:', palindrome.id)
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader pageTitle="Palindrome Cards Showcase" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Palindrome Card Components
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Showcasing the PalindromeCard and PalindromeCardCompact components 
              with various data scenarios including found/unfound palindromes, 
              missing images, and optional fields.
            </p>
          </div>

          {/* Full Cards Section */}
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Full Palindrome Cards</h2>
              <p className="text-muted-foreground">
                Complete cards with all features, actions, and detailed information
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {dummyPalindromes.map((palindrome) => (
                <PalindromeCard
                  key={palindrome.id}
                  palindrome={palindrome}
                  showActions={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </section>

          {/* Compact Cards Section */}
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Compact Palindrome Cards</h2>
              <p className="text-muted-foreground">
                Minimal cards perfect for lists and search results
              </p>
            </div>
            
            <div className="space-y-3 max-w-2xl mx-auto">
              {dummyPalindromes.map((palindrome) => (
                <PalindromeCardCompact
                  key={`compact-${palindrome.id}`}
                  palindrome={palindrome}
                  onClick={handleCardClick}
                />
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Component Features</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">📊 Complete Data Display</h3>
                <p className="text-sm text-muted-foreground">
                  Shows all palindrome information including user profiles, vehicle details, 
                  categories, and timestamps with proper fallbacks for missing data.
                </p>
              </div>
              
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">🎨 Smart Status Badges</h3>
                <p className="text-sm text-muted-foreground">
                  Color-coded status indicators showing whether palindromes have been 
                  found by users or are still waiting to be discovered.
                </p>
              </div>
              
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">🖼️ Responsive Images</h3>
                <p className="text-sm text-muted-foreground">
                  Next.js optimized images with elegant fallbacks for missing or 
                  broken image URLs, maintaining consistent layout.
                </p>
              </div>
              
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">⚡ Action Handlers</h3>
                <p className="text-sm text-muted-foreground">
                  Optional callback props for edit, delete, and view actions 
                  with proper TypeScript typing and error handling.
                </p>
              </div>
              
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">📱 Mobile Responsive</h3>
                <p className="text-sm text-muted-foreground">
                  Mobile-first responsive design that works beautifully across 
                  all device sizes with proper touch interactions.
                </p>
              </div>
              
              <div className="p-6 border rounded-lg">
                <h3 className="font-semibold text-lg mb-2">🌙 Dark Mode Ready</h3>
                <p className="text-sm text-muted-foreground">
                  Full support for light and dark themes with proper color 
                  contrast and accessibility compliance.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}