import type { Core } from '@strapi/strapi';

interface RevalidationConfig {
  frontendUrl: string;
  revalidateSecret?: string;
}

interface RevalidationPayload {
  paths: string[];
  entityType: string;
  entityId: number;
  locale?: string;
}

/**
 * Utility to trigger ISR revalidation in the Next.js frontend
 */
class RevalidationService {
  private config: RevalidationConfig;

  constructor(config: RevalidationConfig) {
    this.config = config;
  }

  /**
   * Call the Next.js revalidate API endpoint
   */
  async revalidate(payload: RevalidationPayload): Promise<void> {
    const { frontendUrl, revalidateSecret } = this.config;

    if (!frontendUrl) {
      console.warn('[Revalidation] FRONTEND_URL not configured, skipping revalidation');
      return;
    }

    try {
      const url = `${frontendUrl}/api/revalidate`;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (revalidateSecret) {
        headers['x-revalidate-secret'] = revalidateSecret;
      }

      console.log(`[Revalidation] Calling ${url} with paths:`, payload.paths);

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Revalidation] Failed: ${response.status} - ${errorText}`);
        return;
      }

      const result = await response.json();
      console.log('[Revalidation] Success:', result);
    } catch (error) {
      console.error('[Revalidation] Error:', error);
    }
  }

  /**
   * Generate revalidation paths for a Product entity
   */
  getProductPaths(product: any, locales: string[]): string[] {
    const paths: string[] = [];

    if (!product.slug) {
      return paths;
    }

    // Generate paths for all locales
    for (const locale of locales) {
      paths.push(`/${locale}/product/${product.slug}`);
    }

    // Also revalidate product listing pages
    for (const locale of locales) {
      paths.push(`/${locale}/product`);
    }

    return paths;
  }

  /**
   * Generate revalidation paths for a Brand entity
   */
  getBrandPaths(brand: any, locales: string[]): string[] {
    const paths: string[] = [];

    if (!brand.slug) {
      return paths;
    }

    // Generate paths for all locales
    for (const locale of locales) {
      paths.push(`/${locale}/brand/${brand.slug}`);
    }

    return paths;
  }

  /**
   * Generate revalidation paths for a Case Study entity
   */
  getCaseStudyPaths(caseStudy: any, locales: string[]): string[] {
    const paths: string[] = [];

    if (!caseStudy.slug) {
      return paths;
    }

    // Generate paths for all locales
    for (const locale of locales) {
      paths.push(`/${locale}/finished-works/${caseStudy.slug}`);
    }

    // Also revalidate listing page
    for (const locale of locales) {
      paths.push(`/${locale}/finished-works`);
    }

    return paths;
  }

  /**
   * Generate revalidation paths for Accessories
   */
  getAccessoryPaths(accessory: any, locales: string[]): string[] {
    const paths: string[] = [];

    // Revalidate accessories page for all locales
    for (const locale of locales) {
      paths.push(`/${locale}/accessories`);
    }

    return paths;
  }

  /**
   * Generate revalidation paths for Gallery
   */
  getGalleryPaths(gallery: any, locales: string[]): string[] {
    const paths: string[] = [];

    // Revalidate gallery page for all locales
    for (const locale of locales) {
      paths.push(`/${locale}/gallery`);
    }

    return paths;
  }

  /**
   * Generate revalidation paths for Glasses
   */
  getGlassesPaths(glasses: any, locales: string[]): string[] {
    const paths: string[] = [];

    // Revalidate glasses page for all locales
    for (const locale of locales) {
      paths.push(`/${locale}/glasses`);
    }

    return paths;
  }

  /**
   * Generate revalidation paths for global data changes
   * (e.g., colors, hardware items that affect multiple products)
   */
  getGlobalPaths(locales: string[]): string[] {
    const paths: string[] = [];

    // Revalidate home and main listing pages
    for (const locale of locales) {
      paths.push(`/${locale}`);
      paths.push(`/${locale}/product`);
    }

    return paths;
  }
}

/**
 * Get all available locales from Strapi
 */
export async function getAvailableLocales(strapi: Core.Strapi): Promise<string[]> {
  try {
    const locales = await strapi.plugin('i18n').service('locales').find();
    return locales.map((locale: any) => locale.code);
  } catch (error) {
    console.error('[Revalidation] Error fetching locales, using default:', error);
    return ['en']; // Fallback to English
  }
}

/**
 * Create a revalidation service instance
 */
export function createRevalidationService(): RevalidationService {
  const frontendUrl = process.env.FRONTEND_URL || '';
  const revalidateSecret = process.env.REVALIDATE_SECRET;

  return new RevalidationService({
    frontendUrl,
    revalidateSecret,
  });
}

export type { RevalidationPayload };
export { RevalidationService };
