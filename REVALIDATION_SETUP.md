# ISR Revalidation Setup

This document explains how to set up Incremental Static Regeneration (ISR) revalidation between your Strapi CMS and Next.js frontend.

## Overview

When content is created, updated, or deleted in Strapi, lifecycle hooks automatically trigger revalidation in your Next.js frontend. This ensures that ISR pages are regenerated with fresh content.

## Setup Instructions

### 1. Configure Strapi Environment Variables

Add the following variables to your `.env` file:

```env
# URL of your Next.js frontend
FRONTEND_URL=http://localhost:3000

# Optional: Secret token for securing revalidation requests
REVALIDATE_SECRET=your_secret_token_here
```

For production:
```env
FRONTEND_URL=https://your-frontend-domain.com
REVALIDATE_SECRET=a_strong_random_secret
```

### 2. Create Next.js Revalidate API Route

In your Next.js project, create `app/api/revalidate/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    // Optional: Verify secret token
    const secret = request.headers.get('x-revalidate-secret');
    if (process.env.REVALIDATE_SECRET && secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    const body = await request.json();
    const { paths, entityType, entityId, locale } = body;

    if (!paths || !Array.isArray(paths)) {
      return NextResponse.json({ message: 'Invalid paths' }, { status: 400 });
    }

    console.log(`[Revalidate] Entity: ${entityType}, ID: ${entityId}, Locale: ${locale}`);
    console.log(`[Revalidate] Paths:`, paths);

    // Revalidate all specified paths
    for (const path of paths) {
      await revalidatePath(path);
      console.log(`[Revalidate] ✓ ${path}`);
    }

    return NextResponse.json({
      revalidated: true,
      paths,
      now: Date.now(),
    });
  } catch (err) {
    console.error('[Revalidate] Error:', err);
    return NextResponse.json(
      { message: 'Error revalidating', error: String(err) },
      { status: 500 }
    );
  }
}
```

### 3. Add Environment Variable to Next.js

In your Next.js `.env.local`:

```env
# Match the secret from Strapi
REVALIDATE_SECRET=your_secret_token_here
```

## Supported Entities

The following entities trigger revalidation:

### Dynamic Routes
- **Product**: `/{locale}/product/{slug}`
- **Brand**: `/{locale}/brand/{slug}`
- **Case Study**: `/{locale}/finished-works/{slug}`

### List Pages
- **Accessories**: `/{locale}/accessories`
- **Gallery**: `/{locale}/gallery`
- **Product Listing**: `/{locale}/product`
- **Finished Works**: `/{locale}/finished-works`

### Global Changes
Changes to these entities revalidate the home page and product listings:
- Color
- Hardware Item
- Product Category
- Product Type

## How It Works

```
┌─────────────────┐
│  Strapi Admin   │  1. User creates/updates content
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Lifecycle Hooks │  2. Strapi detects change
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Revalidation   │  3. Generate paths to revalidate
│     Service     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Next.js API   │  4. POST /api/revalidate
│  /api/revalidate│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  revalidatePath │  5. Next.js regenerates ISR pages
└─────────────────┘
```

## Locale Handling

The system automatically fetches all configured locales from Strapi's i18n plugin and generates revalidation paths for each locale. For example, if you have English (en) and German (de) locales, updating a product will revalidate:

- `/en/product/my-product`
- `/de/product/my-product`

## Testing

### 1. Check Strapi Logs

When Strapi starts, you should see:
```
[Revalidation] ISR lifecycle hooks registered successfully
```

### 2. Create/Update Content

Create or update a product in Strapi admin panel. Check logs for:
```
[Revalidation] Calling http://localhost:3000/api/revalidate with paths: [...]
[Revalidation] Success: {...}
```

### 3. Verify Next.js

Check your Next.js logs for:
```
[Revalidate] Entity: product, ID: 123, Locale: en
[Revalidate] Paths: [ '/en/product/my-product', ... ]
[Revalidate] ✓ /en/product/my-product
```

## Troubleshooting

### Revalidation Not Triggering

1. **Check FRONTEND_URL**: Ensure it's set correctly in Strapi's `.env`
2. **Check Network**: Ensure Strapi can reach your Next.js server
3. **Check Logs**: Look for error messages in both Strapi and Next.js logs

### 401 Unauthorized

The `REVALIDATE_SECRET` doesn't match between Strapi and Next.js. Ensure both have the same value.

### CORS Issues

If your frontend is on a different domain, you may need to configure CORS in Next.js middleware.

## Performance Considerations

- Revalidation happens asynchronously and doesn't block content saves
- Failed revalidations are logged but don't prevent content updates
- Consider rate limiting if you have high-frequency content updates
- For very large sites, you may want to implement a queue system

## Security

- Always use `REVALIDATE_SECRET` in production
- Use HTTPS for production environments
- Consider IP allowlisting for additional security
- The secret is checked via the `x-revalidate-secret` header

## Customization

To add revalidation for additional entities or custom paths, edit:

1. `src/utils/revalidation.ts` - Add new path generator methods
2. `src/index.ts` - Add new lifecycle hook subscriptions

Example for a new entity:

```typescript
// In src/utils/revalidation.ts
getMyEntityPaths(entity: any, locales: string[]): string[] {
  const paths: string[] = [];
  for (const locale of locales) {
    paths.push(`/${locale}/my-entity/${entity.slug}`);
  }
  return paths;
}

// In src/index.ts
strapi.db.lifecycles.subscribe({
  models: ['api::my-entity.my-entity'],
  async afterCreate(event) {
    const { result } = event;
    await triggerRevalidation(result, 'my-entity', (entity, locales) =>
      revalidationService.getMyEntityPaths(entity, locales)
    );
  },
  // ... afterUpdate, afterDelete
});
```
