# ISR Revalidation Setup

This document explains how ISR (Incremental Static Regeneration) revalidation works between your Strapi CMS and Next.js frontend.

## Overview

When content is created, updated, or deleted in Strapi, lifecycle hooks automatically trigger revalidation in your Next.js frontend. This ensures that ISR pages are regenerated with fresh content.

## Setup Instructions

### 1. Configure Strapi Environment Variables

The `.env.example` file already includes the required configuration. Create a `.env` file with:

```env
# URL of your Next.js frontend
FRONTEND_URL=http://localhost:3000

# Bearer token for securing revalidation requests
REVALIDATE_TOKEN=your_revalidate_token_here
```

For production:
```env
FRONTEND_URL=https://your-frontend-domain.com
REVALIDATE_TOKEN=a_strong_random_token
```

### 2. Next.js Revalidate API Route

Your Next.js frontend already has the revalidate API route at `app/api/revalidate/route.ts`. The Strapi backend is configured to work with your existing API structure:

- **Endpoint**: `POST /api/revalidate`
- **Authentication**: `Authorization: Bearer ${REVALIDATE_TOKEN}`
- **Payload**: `{ type, slug, locale }`

### 3. Ensure Environment Variables Match

In your Next.js `.env.local`, make sure the token matches:

```env
# Must match the token in Strapi's .env
REVALIDATE_TOKEN=your_revalidate_token_here
```

## Supported Entities

The following entities trigger revalidation:

### Entities with Dynamic Routes (send type, slug, locale)
- **Product** → Sends `{ type: 'product', slug, locale }`
- **Brand** → Sends `{ type: 'brand', slug, locale }`
- **Case Study** → Sends `{ type: 'case-study', slug, locale }`

### Entities that Revalidate Home Page (send type: 'home')
These entities trigger home page revalidation since they affect global content:
- **Accessory** → Sends `{ type: 'home', locale }`
- **Gallery** → Sends `{ type: 'home' }`
- **Color** → Sends `{ type: 'home' }`
- **Hardware Item** → Sends `{ type: 'home' }`
- **Product Category** → Sends `{ type: 'home', locale }`
- **Product Type** → Sends `{ type: 'home', locale }`

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
│  Revalidation   │  3. Send { type, slug, locale }
│     Service     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Next.js API   │  4. POST /api/revalidate with Bearer token
│  /api/revalidate│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  revalidatePath │  5. Next.js determines paths and regenerates
└─────────────────┘
```

## Locale Handling

Each entity includes its locale in the revalidation request. Your Next.js API route uses this locale to determine which paths to revalidate. For example:

- Product update → `{ type: 'product', slug: 'my-product', locale: 'en' }`
- Next.js revalidates → `/en/product/my-product` and `/en` (home page)

## Testing

### 1. Check Strapi Logs

When Strapi starts, you should see:
```
[Revalidation] ISR lifecycle hooks registered successfully
```

### 2. Create/Update Content

Create or update a product in Strapi admin panel. Check logs for:
```
[Revalidation] Calling http://localhost:3000/api/revalidate with type: product, slug: my-product, locale: en
[Revalidation] Success: { revalidated: true, type: 'product', ... }
```

### 3. Verify Next.js

Check your Next.js logs for successful revalidation based on your API route's logging.

## Troubleshooting

### Revalidation Not Triggering

1. **Check FRONTEND_URL**: Ensure it's set correctly in Strapi's `.env`
2. **Check Network**: Ensure Strapi can reach your Next.js server
3. **Check Logs**: Look for error messages in both Strapi and Next.js logs

### 401 Unauthorized

The `REVALIDATE_TOKEN` doesn't match between Strapi and Next.js. Ensure both have the same value.

### CORS Issues

If your frontend is on a different domain, you may need to configure CORS in Next.js middleware.

## Performance Considerations

- Revalidation happens asynchronously and doesn't block content saves
- Failed revalidations are logged but don't prevent content updates
- Consider rate limiting if you have high-frequency content updates
- For very large sites, you may want to implement a queue system

## Security

- Always use `REVALIDATE_TOKEN` in production
- Use HTTPS for production environments
- Consider IP allowlisting for additional security
- The token is sent via the `Authorization: Bearer ${token}` header

## Customization

To add revalidation for additional entities, edit:

1. **For entities with slugs** (like products, brands):

```typescript
// In src/utils/revalidation.ts - Add a new method
async revalidateMyEntity(slug: string | undefined, locale: string | undefined): Promise<void> {
  await this.revalidate({
    type: 'my-entity',
    slug,
    locale,
  });
}

// In src/index.ts - Add lifecycle hooks
strapi.db.lifecycles.subscribe({
  models: ['api::my-entity.my-entity'],
  async afterCreate(event) {
    const { result } = event;
    await revalidationService.revalidateMyEntity(result.slug, result.locale);
  },
  async afterUpdate(event) {
    const { result } = event;
    await revalidationService.revalidateMyEntity(result.slug, result.locale);
  },
  async afterDelete(event) {
    const { result } = event;
    await revalidationService.revalidateMyEntity(result.slug, result.locale);
  },
});
```

2. **For entities without slugs** (that should trigger home page revalidation):

```typescript
// In src/index.ts - Use revalidateHome()
strapi.db.lifecycles.subscribe({
  models: ['api::my-entity.my-entity'],
  async afterCreate(event) {
    const { result } = event;
    await revalidationService.revalidateHome(result.locale);
  },
  // ... afterUpdate, afterDelete
});
```

3. **Update your Next.js API route** to handle the new entity type in the switch statement.
