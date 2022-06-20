const products = `
  query fetchProducts($currentPage: Int, $pageSize: Int) {
    products(
      currentPage: $currentPage
      search: ""
      pageSize: $pageSize
    ) {
      items {
        __typename
        uid
        sku
        name
        new
        format
        gender
        description {
          ...ComplexTextValueFields
        }
        short_description {
          ...ComplexTextValueFields
        }
        meta_title
        meta_keyword
        meta_description
        url_key
        url_suffix
        url_rewrites {
          url
          parameters {
            name
            value
          }
        }
        thumbnail {
          ...ProductImageFields
        }
        image {
          ...ProductImageFields
        }
        small_image {
          label
          position
          url
          disabled
        }
        media_gallery {
          url
          label
          position
        }
        url_key
        special_price
        swatch_image
        categories {
          uid
          name
          url_path
        }
        ... on ConfigurableProduct {
          variants {
            product {
              name
              uid
              sku
              image {
                label
                url
              }
              media_gallery {
                url
                label
                position
              }
              price_range {
                maximum_price {
                  discount {
                    ...ProductDiscountFields
                  }
                  final_price {
                    ...MoneyFields
                  }
                  fixed_product_taxes {
                    amount {
                      ...MoneyFields
                    }
                    ...FixedProductTaxFields
                  }
                  regular_price {
                    ...MoneyFields
                  }
                }
                minimum_price {
                  discount {
                    ...ProductDiscountFields
                  }
                  final_price {
                    ...MoneyFields
                  }
                  fixed_product_taxes {
                    amount {
                      ...MoneyFields
                    }
                    ...FixedProductTaxFields
                  }
                  regular_price {
                    ...MoneyFields
                  }
                }
              }
            }
            attributes {
              label
              code
              value_index
            }
          }
          configurable_options {
            attribute_uid
            attribute_code
            label
            values {
              label
              uid   
              store_label
              swatch_data {
                value
              }
              value_index
              use_default_value
            }
          }
        }
        ... on GroupedProduct {
          items {
            position
            qty
            product {
              sku
              __typename
            }
          }
        }
        ... on BundleProduct {
          items {
            uid
            options {
              uid
              label
              position
              price
              price_type
              product {
                sku
                __typename
              }
              can_change_quantity
              is_default
            }
          }
        }
        gift_message_available
        manufacturer
        material
        pattern
        performance_fabric
        price_range {
          maximum_price {
            discount {
              ...ProductDiscountFields
            }
            final_price {
              ...MoneyFields
            }
            fixed_product_taxes {
              amount {
                ...MoneyFields
              }
              ...FixedProductTaxFields
            }
            regular_price {
              ...MoneyFields
            }
          }
          minimum_price {
            discount {
              ...ProductDiscountFields
            }
            final_price {
              ...MoneyFields
            }
            fixed_product_taxes {
              amount {
                ...MoneyFields
              }
              ...FixedProductTaxFields
            }
            regular_price {
              ...MoneyFields
            }
          }
        }
        price_tiers {
          discount {
            ...ProductDiscountFields
          }
          final_price {
            ...MoneyFields
          }
          quantity
        }
        rating_summary
        related_products {
          uid
        }
        crosssell_products {
          uid
        }
        upsell_products {
          uid
        }
        review_count
        reviews {
          items {
            average_rating
            created_at
            nickname
            summary
            text
            ratings_breakdown {
              name
              value
            }
          }
          page_info {
            current_page
            page_size
            total_pages
          }
        }
      }
      total_count
    }
  }

  fragment ComplexTextValueFields on ComplexTextValue {
    html
  }

  fragment ProductImageFields on ProductImage {
    label
    url
  }

  fragment ProductDiscountFields on ProductDiscount {
    amount_off
    percent_off
  }

  fragment MoneyFields on Money {
    currency
    value
  }

  fragment FixedProductTaxFields on FixedProductTax {
    label
  }

`

export default products
