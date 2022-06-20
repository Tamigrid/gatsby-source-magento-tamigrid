declare const categories = "\n  query fetchCategories($categoryUids: [String!]) {\n    categoryList(filters: {\n      category_uid:{\n        in: $categoryUids\n      }\n    }) {\n      available_sort_by\n      breadcrumbs {\n        category_level\n        category_name\n        category_uid\n        category_url_key\n        category_url_path\n      }\n      canonical_url\n      children {\n        uid\n      }\n      children_count\n      default_sort_by\n      description\n      image\n      level\n      meta_description\n      meta_keywords\n      meta_title\n      name\n      path\n      path_in_store\n      position\n      product_count\n      relative_url\n      type\n      uid\n      url_key\n      url_path\n      url_suffix\n    }\n  }\n";
export default categories;