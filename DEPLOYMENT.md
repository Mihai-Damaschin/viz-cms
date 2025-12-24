# Deployment Guide for Netlify

This guide will help you deploy your Strapi CMS to Netlify using Docker.

## Prerequisites

- Netlify account with Docker deployment support
- PostgreSQL database (already configured)
- Docker installed locally for testing

## Environment Variables

Make sure to set these environment variables in your Netlify deployment settings:

### Required Secrets
Generate secure random strings for these:
```bash
APP_KEYS="random_key_1,random_key_2"
API_TOKEN_SALT="random_salt"
ADMIN_JWT_SECRET="random_secret"
TRANSFER_TOKEN_SALT="random_salt"
JWT_SECRET="random_secret"
ENCRYPTION_KEY="random_key"
```

You can generate secure keys using:
```bash
# Generate APP_KEYS (need 2 keys, comma-separated)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Generate other secrets
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Database Configuration
```bash
DATABASE_CLIENT=postgres
DATABASE_URL=postgres://postgres:KQ4uLtFlHJQgfGbaiYQ8W7EBQ0R5uvQfwzd6JvqXUsFGkYCeEdqpCsqIOn93UGNw@wko4oc088s0o0ok4ggoc44wk:5432/postgres
```

### Server Configuration
```bash
HOST=0.0.0.0
PORT=1337
NODE_ENV=production
```

## Netlify Configuration

1. **Create `netlify.toml`** (if not exists) with Docker build settings:
```toml
[build]
  command = "docker build -t strapi-app ."
  publish = "."

[build.environment]
  NODE_VERSION = "20"
```

2. **Set Environment Variables** in Netlify Dashboard:
   - Go to Site Settings → Build & Deploy → Environment
   - Add all the environment variables listed above
   - Make sure to replace placeholder values with secure generated keys

## Local Testing

Test the Docker build locally before deploying:

```bash
# Build the Docker image
docker build -t viz-cms:latest .

# Run with docker-compose
docker-compose up -d

# Or run standalone
docker run -p 1337:1337 --env-file .env viz-cms:latest
```

## Deployment Steps

1. **Commit your changes**:
```bash
git add .
git commit -m "Add Docker configuration for Netlify deployment"
git push
```

2. **Connect to Netlify**:
   - Log in to Netlify
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository
   - Configure build settings to use Docker

3. **Deploy**:
   - Netlify will automatically build and deploy using the Dockerfile
   - Monitor the deployment logs for any issues

## Important Notes

- **File Uploads**: For production, configure cloud storage (AWS S3, Cloudinary, etc.) for file uploads instead of local storage
- **Database Migrations**: Run `npm run strapi build` after any schema changes
- **Admin Panel**: Access at `https://your-site.netlify.app/admin`
- **Health Check**: The Dockerfile includes a health check endpoint at `/_health`

## Troubleshooting

### Build Fails
- Check that all environment variables are set correctly
- Verify PostgreSQL connection string is accessible from Netlify

### Database Connection Issues
- Ensure the PostgreSQL database allows connections from Netlify's IP range
- Check SSL requirements (may need `DATABASE_SSL=true`)

### Admin Panel Not Loading
- Clear browser cache
- Check if `NODE_ENV=production` is set
- Verify APP_KEYS are set correctly

## File Upload Configuration (Recommended for Production)

Add a cloud storage provider plugin for uploads:

```bash
npm install @strapi/provider-upload-cloudinary
# or
npm install @strapi/provider-upload-aws-s3
```

Then configure in `config/plugins.ts`:
```typescript
export default {
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
    },
  },
};
```
