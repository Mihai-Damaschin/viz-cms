import type { Core } from '@strapi/strapi';
import { createRevalidationService, getAvailableLocales } from './utils/revalidation';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const revalidationService = createRevalidationService();

    /**
     * Helper function to trigger revalidation with proper locale handling
     */
    const triggerRevalidation = async (
      entity: any,
      entityType: string,
      pathGenerator: (entity: any, locales: string[]) => string[]
    ) => {
      const locales = await getAvailableLocales(strapi);
      const paths = pathGenerator(entity, locales);

      if (paths.length > 0) {
        await revalidationService.revalidate({
          paths,
          entityType,
          entityId: entity.id,
          locale: entity.locale,
        });
      }
    };

    // ============================================================================
    // PRODUCT LIFECYCLE HOOKS
    // ============================================================================
    strapi.db.lifecycles.subscribe({
      models: ['api::product.product'],

      async afterCreate(event) {
        const { result } = event;
        await triggerRevalidation(result, 'product', (product, locales) =>
          revalidationService.getProductPaths(product, locales)
        );
      },

      async afterUpdate(event) {
        const { result } = event;
        await triggerRevalidation(result, 'product', (product, locales) =>
          revalidationService.getProductPaths(product, locales)
        );
      },

      async afterDelete(event) {
        const { result } = event;
        await triggerRevalidation(result, 'product', (product, locales) =>
          revalidationService.getProductPaths(product, locales)
        );
      },
    });

    // ============================================================================
    // BRAND LIFECYCLE HOOKS
    // ============================================================================
    strapi.db.lifecycles.subscribe({
      models: ['api::brand.brand'],

      async afterCreate(event) {
        const { result } = event;
        await triggerRevalidation(result, 'brand', (brand, locales) =>
          revalidationService.getBrandPaths(brand, locales)
        );
      },

      async afterUpdate(event) {
        const { result } = event;
        await triggerRevalidation(result, 'brand', (brand, locales) =>
          revalidationService.getBrandPaths(brand, locales)
        );
      },

      async afterDelete(event) {
        const { result } = event;
        await triggerRevalidation(result, 'brand', (brand, locales) =>
          revalidationService.getBrandPaths(brand, locales)
        );
      },
    });

    // ============================================================================
    // CASE STUDY (FINISHED WORKS) LIFECYCLE HOOKS
    // ============================================================================
    strapi.db.lifecycles.subscribe({
      models: ['api::case-study.case-study'],

      async afterCreate(event) {
        const { result } = event;
        await triggerRevalidation(result, 'case-study', (caseStudy, locales) =>
          revalidationService.getCaseStudyPaths(caseStudy, locales)
        );
      },

      async afterUpdate(event) {
        const { result } = event;
        await triggerRevalidation(result, 'case-study', (caseStudy, locales) =>
          revalidationService.getCaseStudyPaths(caseStudy, locales)
        );
      },

      async afterDelete(event) {
        const { result } = event;
        await triggerRevalidation(result, 'case-study', (caseStudy, locales) =>
          revalidationService.getCaseStudyPaths(caseStudy, locales)
        );
      },
    });

    // ============================================================================
    // ACCESSORY LIFECYCLE HOOKS
    // ============================================================================
    strapi.db.lifecycles.subscribe({
      models: ['api::accessory.accessory'],

      async afterCreate(event) {
        const { result } = event;
        await triggerRevalidation(result, 'accessory', (accessory, locales) =>
          revalidationService.getAccessoryPaths(accessory, locales)
        );
      },

      async afterUpdate(event) {
        const { result } = event;
        await triggerRevalidation(result, 'accessory', (accessory, locales) =>
          revalidationService.getAccessoryPaths(accessory, locales)
        );
      },

      async afterDelete(event) {
        const { result } = event;
        await triggerRevalidation(result, 'accessory', (accessory, locales) =>
          revalidationService.getAccessoryPaths(accessory, locales)
        );
      },
    });

    // ============================================================================
    // GALLERY LIFECYCLE HOOKS
    // ============================================================================
    strapi.db.lifecycles.subscribe({
      models: ['api::gallery.gallery'],

      async afterCreate(event) {
        const { result } = event;
        await triggerRevalidation(result, 'gallery', (gallery, locales) =>
          revalidationService.getGalleryPaths(gallery, locales)
        );
      },

      async afterUpdate(event) {
        const { result } = event;
        await triggerRevalidation(result, 'gallery', (gallery, locales) =>
          revalidationService.getGalleryPaths(gallery, locales)
        );
      },

      async afterDelete(event) {
        const { result } = event;
        await triggerRevalidation(result, 'gallery', (gallery, locales) =>
          revalidationService.getGalleryPaths(gallery, locales)
        );
      },
    });

    // ============================================================================
    // COLOR LIFECYCLE HOOKS (affects Products)
    // ============================================================================
    strapi.db.lifecycles.subscribe({
      models: ['api::color.color'],

      async afterCreate(event) {
        const { result } = event;
        const locales = await getAvailableLocales(strapi);
        const paths = revalidationService.getGlobalPaths(locales);
        await revalidationService.revalidate({
          paths,
          entityType: 'color',
          entityId: result.id,
        });
      },

      async afterUpdate(event) {
        const { result } = event;
        const locales = await getAvailableLocales(strapi);
        const paths = revalidationService.getGlobalPaths(locales);
        await revalidationService.revalidate({
          paths,
          entityType: 'color',
          entityId: result.id,
        });
      },

      async afterDelete(event) {
        const { result } = event;
        const locales = await getAvailableLocales(strapi);
        const paths = revalidationService.getGlobalPaths(locales);
        await revalidationService.revalidate({
          paths,
          entityType: 'color',
          entityId: result.id,
        });
      },
    });

    // ============================================================================
    // HARDWARE ITEM LIFECYCLE HOOKS (affects Products)
    // ============================================================================
    strapi.db.lifecycles.subscribe({
      models: ['api::hardware-item.hardware-item'],

      async afterCreate(event) {
        const { result } = event;
        const locales = await getAvailableLocales(strapi);
        const paths = revalidationService.getGlobalPaths(locales);
        await revalidationService.revalidate({
          paths,
          entityType: 'hardware-item',
          entityId: result.id,
        });
      },

      async afterUpdate(event) {
        const { result } = event;
        const locales = await getAvailableLocales(strapi);
        const paths = revalidationService.getGlobalPaths(locales);
        await revalidationService.revalidate({
          paths,
          entityType: 'hardware-item',
          entityId: result.id,
        });
      },

      async afterDelete(event) {
        const { result } = event;
        const locales = await getAvailableLocales(strapi);
        const paths = revalidationService.getGlobalPaths(locales);
        await revalidationService.revalidate({
          paths,
          entityType: 'hardware-item',
          entityId: result.id,
        });
      },
    });

    // ============================================================================
    // PRODUCT CATEGORY LIFECYCLE HOOKS
    // ============================================================================
    strapi.db.lifecycles.subscribe({
      models: ['api::product-category.product-category'],

      async afterCreate(event) {
        const { result } = event;
        const locales = await getAvailableLocales(strapi);
        const paths = revalidationService.getGlobalPaths(locales);
        await revalidationService.revalidate({
          paths,
          entityType: 'product-category',
          entityId: result.id,
        });
      },

      async afterUpdate(event) {
        const { result } = event;
        const locales = await getAvailableLocales(strapi);
        const paths = revalidationService.getGlobalPaths(locales);
        await revalidationService.revalidate({
          paths,
          entityType: 'product-category',
          entityId: result.id,
        });
      },

      async afterDelete(event) {
        const { result } = event;
        const locales = await getAvailableLocales(strapi);
        const paths = revalidationService.getGlobalPaths(locales);
        await revalidationService.revalidate({
          paths,
          entityType: 'product-category',
          entityId: result.id,
        });
      },
    });

    // ============================================================================
    // PRODUCT TYPE LIFECYCLE HOOKS
    // ============================================================================
    strapi.db.lifecycles.subscribe({
      models: ['api::product-type.product-type'],

      async afterCreate(event) {
        const { result } = event;
        const locales = await getAvailableLocales(strapi);
        const paths = revalidationService.getGlobalPaths(locales);
        await revalidationService.revalidate({
          paths,
          entityType: 'product-type',
          entityId: result.id,
        });
      },

      async afterUpdate(event) {
        const { result } = event;
        const locales = await getAvailableLocales(strapi);
        const paths = revalidationService.getGlobalPaths(locales);
        await revalidationService.revalidate({
          paths,
          entityType: 'product-type',
          entityId: result.id,
        });
      },

      async afterDelete(event) {
        const { result } = event;
        const locales = await getAvailableLocales(strapi);
        const paths = revalidationService.getGlobalPaths(locales);
        await revalidationService.revalidate({
          paths,
          entityType: 'product-type',
          entityId: result.id,
        });
      },
    });

    console.log('[Revalidation] ISR lifecycle hooks registered successfully');
  },
};
