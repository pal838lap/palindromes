# Google OAuth Setup Instructions

Follow these steps to configure Google OAuth for your Next.js application.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "New Project" or select an existing project
3. Enter a project name (e.g., "My NextJS App")
4. Click "Create"

## Step 2: Initial App Configuration

1. In your Google Cloud Console project, you'll see the **Overview** page
2. Click **Get Started** in the main dashboard
3. You'll be prompted to configure your app:
   - **App name**: Enter your application name
   - **User support email**: Enter your email address
4. Complete this initial setup

## Step 3: Create OAuth Client ID

1. Navigate to **Credentials** (you might see this under a "Clients" section)
2. Click **Create OAuth client ID**
3. If prompted about OAuth consent screen, you'll need to configure it first:
   - Choose **External** user type (unless you have Google Workspace)
   - Fill in the required information (app name and user support email should already be set)
   - Click through the consent screen setup
4. Return to creating the OAuth client ID

## Step 4: Configure OAuth Client

1. Select **Application type**: **Web application**
2. Enter a name for your OAuth client (e.g., "NextJS Auth Client")
3. Configure **Authorized JavaScript origins**:
   - For development: `http://localhost:3000`
   - For production: `https://yourdomain.com`
4. Configure **Authorized redirect URIs**:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
5. Click **Create**
6. Copy the **Client ID** and **Client Secret** from the popup

## Step 5: Update Environment Variables

Add the Google OAuth credentials to your `.env.local` file:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000`
3. Click "Sign In"
4. You should see the "Continue with Google" button
5. Click it to test the OAuth flow

## Alternative: Manual OAuth Consent Screen Setup

If you need to manually configure the OAuth consent screen:

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External** user type
3. Fill in the OAuth consent screen form:
   - **App name**: Your app name
   - **User support email**: Your email
   - **App logo**: (optional)
   - **App domain**: Your domain (for production)
   - **Developer contact information**: Your email
4. Click **Save and Continue** through all steps
5. Add test users if needed for development

## Production Deployment

When deploying to production (e.g., Vercel):

1. Edit your OAuth client and add production URLs:
   - **Authorized JavaScript origins**: `https://your-app.vercel.app`
   - **Authorized redirect URIs**: `https://your-app.vercel.app/api/auth/callback/google`
2. Add the environment variables to your hosting platform
3. For public use, submit your app for verification in the OAuth consent screen

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**:
   - Check that your redirect URI exactly matches what's configured in Google Console
   - Make sure you're using the correct domain (localhost for dev, your domain for prod)

2. **"access_blocked" error**:
   - Your app needs to be verified if you want to use it publicly
   - For testing, add your email to the test users list in OAuth consent screen

3. **"invalid_client" error**:
   - Double-check your Client ID and Client Secret
   - Make sure they're correctly set in your environment variables

### Development vs Production

- **Development**: Use `http://localhost:3000` for origins and callbacks
- **Production**: Use your actual domain with `https://`

## Security Notes

- Never commit your `GOOGLE_CLIENT_SECRET` to version control
- Keep your credentials secure
- Consider rotating credentials periodically
- For production apps, complete the OAuth consent screen verification process

---

*Last updated: August 23, 2025*

## Step 5: Update Environment Variables

Add the Google OAuth credentials to your `.env.local` file:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000`
3. Click "Sign In"
4. You should see the "Continue with Google" button
5. Click it to test the OAuth flow

## Production Deployment

When deploying to production (e.g., Vercel):

1. Add your production domain to the **Authorized JavaScript origins**:
   - `https://your-app.vercel.app`
2. Add your production callback URL to **Authorized redirect URIs**:
   - `https://your-app.vercel.app/api/auth/callback/google`
3. Add the environment variables to your hosting platform
4. Update the OAuth consent screen with your production domain

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**:
   - Check that your redirect URI exactly matches what's configured in Google Console
   - Make sure you're using the correct domain (localhost for dev, your domain for prod)

2. **"access_blocked" error**:
   - Your app needs to be verified if you want to use it publicly
   - For testing, add your email to the test users list

3. **"invalid_client" error**:
   - Double-check your Client ID and Client Secret
   - Make sure they're correctly set in your environment variables

### Development vs Production

- **Development**: Use `http://localhost:3000` for origins and callbacks
- **Production**: Use your actual domain with `https://`

## Security Notes

- Never commit your `GOOGLE_CLIENT_SECRET` to version control
- Keep your credentials secure
- Consider rotating credentials periodically
- For production apps, complete the OAuth consent screen verification process

---

*Last updated: August 23, 2025*

