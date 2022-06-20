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
      default_sort_by
      description
      image
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
`

export default categories
