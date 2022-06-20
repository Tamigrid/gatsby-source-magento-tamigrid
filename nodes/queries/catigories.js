"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const categories = `
  query fetchCategories($categoryUids: [String!]) {
    categoryList(filters: {
      category_uid:{
        in: $categoryUids
      }
    }) {
      available_sort_by
      breadcrumbs {
        category_level
        category_name
        category_uid
        category_url_key
        category_url_path
      }
      canonical_url
      children {
        uid
      }
      children_count
      custom_layout_update_file
      default_sort_by
      description
      display_mode
      filter_price_range
      id
      image
      include_in_menu
      is_anchor
      landing_page
      level
      meta_description
      meta_keywords
      meta_title
      name
      path
      path_in_store
      position
      product_count
      relative_url
      type
      uid
      url_key
      url_path
      url_suffix
    }
  }
`;
exports.default = categories;
//# sourceMappingURL=catigories.js.map