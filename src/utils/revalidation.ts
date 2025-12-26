import type { Core } from '@strapi/strapi';

interface RevalidationConfig {
  frontendUrl: string;
  revalidateToken?: string;
}

interface RevalidationPayload {
  type: string;
  slug?: string;
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
    const { frontendUrl, revalidateToken } = this.config;

    if (!frontendUrl) {
      console.warn('[Revalidation] FRONTEND_URL not configured, skipping revalidation');
      return;
    }

    try {
      const url = `${frontendUrl}/api/revalidate`;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (revalidateToken) {
        headers['Authorization'] = `Bearer ${revalidateToken}`;
      }

      console.log(`[Revalidation] Calling ${url} with type: ${payload.type}, slug: ${payload.slug}, locale: ${payload.locale}`);

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
   * Revalidate a product entity
   */
  async revalidateProduct(slug: string | undefined, locale: string | undefined): Promise<void> {
    await this.revalidate({
      type: 'product',
      slug,
      locale,
    });
  }

  /**
   * Revalidate a brand entity
   */
  async revalidateBrand(slug: string | undefined, locale: string | undefined): Promise<void> {
    await this.revalidate({
      type: 'brand',
      slug,
      locale,
    });
  }

  /**
   * Revalidate a case study entity
   */
  async revalidateCaseStudy(slug: string | undefined, locale: string | undefined): Promise<void> {
    await this.revalidate({
      type: 'case-study',
      slug,
      locale,
    });
  }

  /**
   * Revalidate home page
   */
  async revalidateHome(locale?: string): Promise<void> {
    await this.revalidate({
      type: 'home',
      locale,
    });
  }

  /**
   * Revalidate all pages (use with caution)
   */
  async revalidateAll(): Promise<void> {
    await this.revalidate({
      type: 'all',
    });
  }
}

/**
 * Create a revalidation service instance
 */
export function createRevalidationService(): RevalidationService {
  const frontendUrl = process.env.FRONTEND_URL || '';
  const revalidateToken = process.env.REVALIDATE_TOKEN;

  return new RevalidationService({
    frontendUrl,
    revalidateToken,
  });
}

export type { RevalidationPayload };
export { RevalidationService };
