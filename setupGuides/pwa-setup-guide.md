# PWA Setup Guide for Template Users

This guide shows you how to customize the PWA (Progressive Web App) configuration for your own project.

## What You Need to Update

### 1. Update App Information in `manifest.json`

Edit `/public/manifest.json` and change these fields:

```json
{
  "name": "Your App Name Here",
  "short_name": "YourApp",
  "description": "Your app description here",
  // ... rest stays the same
}
```

**Fields to customize:**
- `name` - Full app name (shown during installation)
- `short_name` - Short name (shown on home screen, max 12 characters)
- `description` - Brief description of your app

### 2. Replace Icon Files

Replace all icon files in `/public/icons/` with your own:

**Required PNG files:**
- `template-48x48.png`
- `template-72x72.png`
- `template-96x96.png`
- `template-128x128.png`
- `template-144x144.png`
- `template-152x152.png`
- `template-192x192.png`
- `template-256x256.png`
- `template-384x384.png`
- `template-512x512.png`

**Icon requirements:**
- Format: PNG
- Square dimensions (width = height)
- Same design across all sizes
- Transparent or solid background

### 3. Replace Screenshot Files

Replace these files in `/public/icons/`:

- `screenshot-wide.png` (1280x720 pixels) - Desktop view
- `screenshot-narrow.png` (750x1334 pixels) - Mobile view

**Screenshot tips:**
- Show your actual app interface
- Make them look appealing (users see these during install)
- Desktop: landscape orientation
- Mobile: portrait orientation

### 4. Optional: Update Theme Colors

In `/public/manifest.json`, customize colors:

```json
{
  "background_color": "#ffffff",  // App background color
  "theme_color": "#000000"        // Status bar color
}
```

## Testing Your PWA

1. Start development server: `npm run dev`
2. Open `http://localhost:3001` in Chrome
3. Check DevTools → Application → Manifest for errors
4. Look for install button in address bar
5. Test installation

## Tools for Creating Icons

**Recommended:**
- [PWA Icon Generator](https://pwa-icon-generator.vercel.app) - Upload one image, get all sizes
- [Favicon.io](https://favicon.io/favicon-generator/) - Create icons from text or image
- [Real Favicon Generator](https://realfavicongenerator.net/) - Comprehensive icon generator

**Manual:**
- Design in Figma/Sketch at 512x512, export all sizes
- Use online resizing tools for different dimensions

---

That's it! Your PWA will be ready to install on any device. 🚀
