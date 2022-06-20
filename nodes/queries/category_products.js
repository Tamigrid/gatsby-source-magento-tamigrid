"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const categoryProducts = `
  query categoryProducts($uid: String!,$currentPage: Int!) {
    products(
      search: ""
      filter: { category_uid: { eq: $uid } }
      currentPage: $currentPage
    ) {
      aggregations {
        __typename
        label
        count
        attribute_code
        options {
          __typename
          label
          value
          count
        }
        position
      }
      sort_fields {
        default
        options {
          label
          value
          __typename
        }
      }
      items {
        uid
      }
    }
  }
  
`;
exports.default = categoryProducts;
//# sourceMappingURL=category_products.js.map