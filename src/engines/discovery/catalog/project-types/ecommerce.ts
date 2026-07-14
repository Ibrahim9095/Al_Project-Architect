import type { ProjectTypeDefinition } from "../types";

export const ecommerceProjectType: ProjectTypeDefinition = {
  id: "ecommerce",
  label: "E-Commerce",
  description: "Online store, catalog, carts, checkout, and order management.",
  roleOptions: [
    { value: "customer", label: "Customer" },
    { value: "admin", label: "Administrator" },
    { value: "store_manager", label: "Store Manager" },
    { value: "support_agent", label: "Support Agent" },
    { value: "warehouse_staff", label: "Warehouse Staff" },
  ],
  moduleOptions: [
    { value: "catalog", label: "Product Catalog" },
    { value: "cart", label: "Shopping Cart" },
    { value: "checkout", label: "Checkout" },
    { value: "orders", label: "Order Management" },
    { value: "inventory", label: "Inventory" },
    { value: "customers", label: "Customer Accounts" },
    { value: "promotions", label: "Promotions & Coupons" },
  ],
  featureOptions: [
    { value: "product_search", label: "Product Search & Filters" },
    { value: "wishlist", label: "Wishlist" },
    { value: "reviews", label: "Product Reviews" },
    { value: "guest_checkout", label: "Guest Checkout" },
    { value: "order_tracking", label: "Order Tracking" },
    { value: "returns", label: "Returns & Refunds" },
  ],
  integrationOptions: [
    { value: "stripe", label: "Stripe" },
    { value: "paypal", label: "PayPal" },
    { value: "shipping_carrier", label: "Shipping Carrier API" },
    { value: "email", label: "Email Provider" },
    { value: "analytics", label: "Analytics" },
  ],
  steps: [
    {
      id: "ecommerce-capabilities",
      title: "E-Commerce Capabilities",
      description: "Select the store modules and shopping features required.",
      questions: [
        {
          id: "modules",
          label: "Required modules",
          type: "multiselect",
          required: true,
          mapsTo: "modules",
          options: [],
        },
        {
          id: "features",
          label: "Required features",
          type: "multiselect",
          required: true,
          mapsTo: "features",
          options: [],
        },
      ],
    },
    {
      id: "ecommerce-integrations",
      title: "E-Commerce Integrations",
      description: "Select external services the store must connect to.",
      questions: [
        {
          id: "integrations",
          label: "Integrations",
          type: "multiselect",
          required: false,
          mapsTo: "integrations",
          options: [],
        },
      ],
    },
  ],
};
