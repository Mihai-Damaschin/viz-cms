import type { Schema, Struct } from '@strapi/strapi';

export interface KeyFeaturesFeatures extends Struct.ComponentSchema {
  collectionName: 'components_key_features_features';
  info: {
    displayName: 'features';
  };
  attributes: {
    description: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface KeyFeaturesKeyFeatures extends Struct.ComponentSchema {
  collectionName: 'components_key_features_key_features';
  info: {
    displayName: 'Key features';
  };
  attributes: {
    description: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

export interface SpecificationsSpecifications extends Struct.ComponentSchema {
  collectionName: 'components_specifications_specifications';
  info: {
    displayName: 'Specifications';
  };
  attributes: {
    description: Schema.Attribute.String;
    title: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'key-features.features': KeyFeaturesFeatures;
      'key-features.key-features': KeyFeaturesKeyFeatures;
      'specifications.specifications': SpecificationsSpecifications;
    }
  }
}
