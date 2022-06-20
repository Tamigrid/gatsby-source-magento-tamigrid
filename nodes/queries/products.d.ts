declare const products = "\n  query fetchProducts($currentPage: Int, $pageSize: Int) {\n    products(\n      currentPage: $currentPage\n      search: \"\"\n      pageSize: $pageSize\n    ) {\n      items {\n        __typename\n        uid\n        sku\n        name\n        new\n        format\n        gender\n        description {\n          ...ComplexTextValueFields\n        }\n        short_description {\n          ...ComplexTextValueFields\n        }\n        meta_title\n        meta_keyword\n        meta_description\n        url_key\n        url_suffix\n        url_rewrites {\n          url\n          parameters {\n            name\n            value\n          }\n        }\n        thumbnail {\n          ...ProductImageFields\n        }\n        image {\n          ...ProductImageFields\n        }\n        small_image {\n          label\n          position\n          url\n          disabled\n        }\n        media_gallery {\n          url\n          label\n          position\n        }\n        url_key\n        special_price\n        swatch_image\n        categories {\n          uid\n          name\n          url_path\n        }\n        ... on ConfigurableProduct {\n          variants {\n            product {\n              name\n              uid\n              sku\n              image {\n                label\n                url\n              }\n              media_gallery {\n                url\n                label\n                position\n              }\n              price_range {\n                maximum_price {\n                  discount {\n                    ...ProductDiscountFields\n                  }\n                  final_price {\n                    ...MoneyFields\n                  }\n                  fixed_product_taxes {\n                    amount {\n                      ...MoneyFields\n                    }\n                    ...FixedProductTaxFields\n                  }\n                  regular_price {\n                    ...MoneyFields\n                  }\n                }\n                minimum_price {\n                  discount {\n                    ...ProductDiscountFields\n                  }\n                  final_price {\n                    ...MoneyFields\n                  }\n                  fixed_product_taxes {\n                    amount {\n                      ...MoneyFields\n                    }\n                    ...FixedProductTaxFields\n                  }\n                  regular_price {\n                    ...MoneyFields\n                  }\n                }\n              }\n            }\n            attributes {\n              label\n              code\n              value_index\n            }\n          }\n          configurable_options {\n            attribute_uid\n            attribute_code\n            label\n            values {\n              label\n              uid   \n              store_label\n              swatch_data {\n                value\n              }\n              value_index\n              use_default_value\n            }\n          }\n        }\n        ... on GroupedProduct {\n          items {\n            position\n            qty\n            product {\n              sku\n              __typename\n            }\n          }\n        }\n        ... on BundleProduct {\n          items {\n            uid\n            options {\n              uid\n              label\n              position\n              price\n              price_type\n              product {\n                sku\n                __typename\n              }\n              can_change_quantity\n              is_default\n            }\n          }\n        }\n        gift_message_available\n        manufacturer\n        material\n        pattern\n        performance_fabric\n        price_range {\n          maximum_price {\n            discount {\n              ...ProductDiscountFields\n            }\n            final_price {\n              ...MoneyFields\n            }\n            fixed_product_taxes {\n              amount {\n                ...MoneyFields\n              }\n              ...FixedProductTaxFields\n            }\n            regular_price {\n              ...MoneyFields\n            }\n          }\n          minimum_price {\n            discount {\n              ...ProductDiscountFields\n            }\n            final_price {\n              ...MoneyFields\n            }\n            fixed_product_taxes {\n              amount {\n                ...MoneyFields\n              }\n              ...FixedProductTaxFields\n            }\n            regular_price {\n              ...MoneyFields\n            }\n          }\n        }\n        price_tiers {\n          discount {\n            ...ProductDiscountFields\n          }\n          final_price {\n            ...MoneyFields\n          }\n          quantity\n        }\n        rating_summary\n        related_products {\n          uid\n        }\n        crosssell_products {\n          uid\n        }\n        upsell_products {\n          uid\n        }\n        review_count\n        reviews {\n          items {\n            average_rating\n            created_at\n            nickname\n            summary\n            text\n            ratings_breakdown {\n              name\n              value\n            }\n          }\n          page_info {\n            current_page\n            page_size\n            total_pages\n          }\n        }\n      }\n      total_count\n    }\n  }\n\n  fragment ComplexTextValueFields on ComplexTextValue {\n    html\n  }\n\n  fragment ProductImageFields on ProductImage {\n    label\n    url\n  }\n\n  fragment ProductDiscountFields on ProductDiscount {\n    amount_off\n    percent_off\n  }\n\n  fragment MoneyFields on Money {\n    currency\n    value\n  }\n\n  fragment FixedProductTaxFields on FixedProductTax {\n    label\n  }\n\n";
export default products;