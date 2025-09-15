# Navigation Architecture

## Overview
Mobile-first responsive navigation with hamburger menu for mobile and clean desktop nav. Modular, accessible, and consistent across the app.

## Components

### SiteHeader
- Main header container
- Always shows app name, optional page title
- Clickable logo links to home
- Contains MobileNav + DesktopNav

### MobileNav
- Hamburger menu using Sheet component
- Hidden on desktop (`md:hidden`)
- Slide-out from left with navigation, auth, and theme toggle

### DesktopNav  
- Clean horizontal navigation for `md:` and above
- Shows navigation links, authentication, and theme toggle

## Navigation Items
```typescript
const navigationItems = [
  { title: "Home", href: "/", icon: Home, public: true },
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard, protected: true },
]
```

## Adding New Pages
1. Add item to `navigationItems` array in both nav components
2. Set `public: true` or `protected: true`
3. Import appropriate Lucide icon

## Breakpoints
- **Mobile**: `< 768px` - Hamburger menu
- **Desktop**: `>= 768px` - Horizontal nav
- **Large**: `>= 1024px` - Full user info
