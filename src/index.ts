import type { Core } from '@strapi/strapi';
import { createRevalidationService } from './utils/revalidation';

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

    // ============================================================================
    // PRODUCT LIFECYCLE HOOKS
    // ============================================================================
    strapi.db.lifecycles.subscribe({
      models: ['api::product.product'],

      async afterCreate(event) {
        const { result } = event;
        await revalidationService.revalidateProduct(result.slug, result.locale);
      },

      async afterUpdate(event) {
        const { result } = event;
        await revalidationService.revalidateProduct(result.slug, result.locale);
      },

      async afterDelete(event) {
        const { result } = event;
        await revalidationService.revalidateProduct(result.slug, result.locale);
      },
    });

    // ============================================================================
    // BRAND LIFECYCLE HOOKS
    // ============================================================================
    strapi.db.lifecycles.subscribe({
      models: ['api::brand.brand'],

      async afterCreate(event) {
        const { result } = event;
        await revalidationService.revalidateBrand(result.slug, result.locale);
      },

      async afterUpdate(event) {
        const { result } = event;
        await revalidationService.revalidateBrand(result.slug, result.locale);
      },

      async afterDelete(event) {
        const { result } = event;
        await revalidationService.revalidateBrand(result.slug, result.locale);
      },
    });

    // ============================================================================
    // CASE STUDY (FINISHED WORKS) LIFECYCLE HOOKS
    // ============================================================================
    strapi.db.lifecycles.subscribe({
      models: ['api::case-study.case-study'],

      async afterCreate(event) {
        const { result } = event;
        await revalidationService.revalidateCaseStudy(result.slug, result.locale);
      },

      async afterUpdate(event) {
        const { result } = event;
        await revalidationService.revalidateCaseStudy(result.slug, result.locale);
      },

      async afterDelete(event) {
        const { result } = event;
        await revalidationService.revalidateCaseStudy(result.slug, result.locale);
      },
    });

    // ============================================================================
    // ACCESSORY LIFECYCLE HOOKS - Revalidate home page
    // ============================================================================
    strapi.db.lifecycles.subscribe({
      models: ['api::accessory.accessory'],

      async afterCreate(event) {
        const { result } = event;
        await revalidationService.revalidateHome(result.locale);
      },

      async afterUpdate(event) {
        const { result } = event;
        await revalidationService.revalidateHome(result.locale);
      },

      async afterDelete(event) {
        const { result } = event;
        await revalidationService.revalidateHome(result.locale);
      },
    });

    // ============================================================================
    // GALLERY LIFECYCLE HOOKS - Revalidate home page
    // ============================================================================
    strapi.db.lifecycles.subscribe({
      models: ['api::gallery.gallery'],

      async afterCreate() {
        await revalidationService.revalidateHome();
      },

      async afterUpdate() {
        await revalidationService.revalidateHome();
      },

      async afterDelete() {
        await revalidationService.revalidateHome();
      },
    });

    // ============================================================================
    // COLOR LIFECYCLE HOOKS (affects Products) - Revalidate home page
    // ============================================================================
    strapi.db.lifecycles.subscribe({
      models: ['api::color.color'],

      async afterCreate() {
        await revalidationService.revalidateHome();
      },

      async afterUpdate() {
        await revalidationService.revalidateHome();
      },

      async afterDelete() {
        await revalidationService.revalidateHome();
      },
    });

    // ============================================================================
    // HARDWARE ITEM LIFECYCLE HOOKS (affects Products) - Revalidate home page
    // ============================================================================
    strapi.db.lifecycles.subscribe({
      models: ['api::hardware-item.hardware-item'],

      async afterCreate() {
        await revalidationService.revalidateHome();
      },

      async afterUpdate() {
        await revalidationService.revalidateHome();
      },

      async afterDelete() {
        await revalidationService.revalidateHome();
      },
    });

    // ============================================================================
    // PRODUCT CATEGORY LIFECYCLE HOOKS - Revalidate home page
    // ============================================================================
    strapi.db.lifecycles.subscribe({
      models: ['api::product-category.product-category'],

      async afterCreate(event) {
        const { result } = event;
        await revalidationService.revalidateHome(result.locale);
      },

      async afterUpdate(event) {
        const { result } = event;
        await revalidationService.revalidateHome(result.locale);
      },

      async afterDelete(event) {
        const { result } = event;
        await revalidationService.revalidateHome(result.locale);
      },
    });

    // ============================================================================
    // PRODUCT TYPE LIFECYCLE HOOKS - Revalidate home page
    // ============================================================================
    strapi.db.lifecycles.subscribe({
      models: ['api::product-type.product-type'],

      async afterCreate(event) {
        const { result } = event;
        await revalidationService.revalidateHome(result.locale);
      },

      async afterUpdate(event) {
        const { result } = event;
        await revalidationService.revalidateHome(result.locale);
      },

      async afterDelete(event) {
        const { result } = event;
        await revalidationService.revalidateHome(result.locale);
      },
    });

    console.log('[Revalidation] ISR lifecycle hooks registered successfully');
  },
};
