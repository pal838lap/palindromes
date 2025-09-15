# GitHub OAuth Setup Instructions

Follow these steps to configure GitHub OAuth for your Next.js application.

## Step 1: Create a GitHub OAuth App

1. Go to [GitHub](https://github.com) and sign in
2. Click your profile picture → **Settings**
3. In the left sidebar, click **Developer settings**
4. Click **OAuth Apps**
5. Click **New OAuth App**

## Step 2: Configure OAuth App Settings

Fill in the OAuth app form:

- **Application name**: Your app name (e.g., "My NextJS Template")
- **Homepage URL**: 
  - For development: `http://localhost:3000`
  - For production: `https://your-domain.com`
- **Application description**: (optional) Brief description of your app
- **Authorization callback URL**:
  - For development: `http://localhost:3000/api/auth/callback/github`
  - For production: `https://your-domain.com/api/auth/callback/github`

Click **Register application**

## Step 3: Get Your Credentials

1. After creating the app, you'll see the **Client ID**
2. Click **Generate a new client secret**
3. Copy both the **Client ID** and **Client Secret**

## Step 4: Update Environment Variables

Add the GitHub OAuth credentials to your `.env.local` file:

```bash
# GitHub OAuth
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

## Step 5: Test the Integration

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000`
3. Click "Sign In"
4. You should see the "Continue with GitHub" button
5. Click it to test the OAuth flow

## Production Deployment

When deploying to production:

1. Create a new OAuth App for production OR update the existing one:
   - **Homepage URL**: `https://your-app.vercel.app`
   - **Authorization callback URL**: `https://your-app.vercel.app/api/auth/callback/github`
2. Add the environment variables to your hosting platform

## Multiple Environments (Recommended)

For better security, create separate OAuth apps:

### Development App
- **Homepage URL**: `http://localhost:3000`
- **Callback URL**: `http://localhost:3000/api/auth/callback/github`

### Production App  
- **Homepage URL**: `https://your-domain.com`
- **Callback URL**: `https://your-domain.com/api/auth/callback/github`

Use different Client IDs and Secrets for each environment.

## Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**:
   - Check that your callback URL exactly matches what's configured in GitHub
   - Make sure you're using the correct protocol (http for localhost, https for production)

2. **"bad_verification_code" error**:
   - Double-check your Client ID and Client Secret
   - Make sure they're correctly set in your environment variables

3. **"incorrect_client_credentials" error**:
   - Verify your Client ID and Client Secret are correct
   - Make sure there are no extra spaces or characters

### Development vs Production

- **Development**: Use `http://localhost:3000` 
- **Production**: Use your actual domain with `https://`

## Security Notes

- Never commit your `GITHUB_CLIENT_SECRET` to version control
- Keep your credentials secure
- Consider rotating secrets periodically
- Use different OAuth apps for development and production environments

## Permissions

By default, GitHub OAuth will request:
- Access to your public profile information
- Access to your email address

The template doesn't request additional permissions, but you can modify the scopes in the auth configuration if needed.

---

*Last updated: August 23, 2025*
