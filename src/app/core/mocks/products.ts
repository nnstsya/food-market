import { Product, ProductItem } from '@core/models/product.model';

export const productsData: Product[] = [
  {
    id: 1,
    name: 'Fennel mini',
    image: [
      'https://d1q864mr06oufu.cloudfront.net/farmy-s3/public/spree/products/142519/large/Reust-Mini_Fenchel__200g-farmy-ch-01.JPG?1726140275'
    ],
    price: 22,
    SKU: 'FEN200-001',
    category: 'Vegetables',
    subcategory: 'Root Vegetables',
    farm: 'Reust Farm',
    stoke: 'In Stock',
    freshness: 5,
    buyBy: ['piece'],
    deliveryDays: 2,
    deliveryAria: 'Zurich, Switzerland',
    maxKgs: 5,
    description: 'Fresh and organic fennel mini, perfect for salads.',
    rate: 4.5,
    tax: 2,
    createdAt: '2025-02-01T10:00:00Z',
    updatedAt: '2025-02-15T12:30:00Z'
  },
  {
    id: 2,
    name: 'Eggplant Graffiti',
    image: [
      'https://static.wixstatic.com/media/fa4cb1_b7e909a82e6a4fb9bd7fa2dbe616a67b~mv2.jpg/v1/fill/w_520,h_520,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/fa4cb1_b7e909a82e6a4fb9bd7fa2dbe616a67b~mv2.jpg'
    ],
    price: 19,
    SKU: 'EGG-GRAF-001',
    category: 'Vegetables',
    subcategory: 'Eggplants',
    farm: 'Organic Farms',
    stoke: 'In Stock',
    freshness: 4,
    buyBy: ['kg'],
    deliveryDays: 3,
    deliveryAria: 'Geneva, Switzerland',
    maxKgs: 10,
    description: 'Beautiful striped eggplants, ideal for grilling and roasting.',
    rate: 4.7,
    tax: 1.8,
    createdAt: '2025-02-02T11:15:00Z',
    updatedAt: '2025-02-16T14:00:00Z'
  },
  {
    id: 3,
    name: 'Vacuum boiled whole chestnuts',
    image: [
      'https://www.caterite.co.uk/media/catalog/product/cache/011c574705791770524050d6d2a24703/d/0/d09b98c2a7c670b4eb2a6f96348620d1.jpg'
    ],
    price: 29,
    SKU: 'CHEST-VAC-001',
    category: 'Nuts & Seeds',
    subcategory: 'Chestnuts',
    farm: 'Mountain Farms',
    stoke: 'Limited Stock',
    freshness: 3,
    buyBy: ['piece'],
    deliveryDays: 5,
    deliveryAria: 'Bern, Switzerland',
    maxKgs: 3,
    description: 'Vacuum-packed boiled chestnuts, ready to eat or cook.',
    rate: 4.2,
    tax: 2.5,
    createdAt: '2025-01-28T09:45:00Z',
    updatedAt: '2025-02-14T10:10:00Z'
  },
  {
    id: 4,
    name: 'Organic Strawberries',
    image: [
      'https://upload.wikimedia.org/wikipedia/commons/2/29/PerfectStrawberry.jpg'
    ],
    price: 15,
    SKU: 'STRAW-500-ORG',
    category: 'Fruits',
    subcategory: 'Berries',
    farm: 'Berry Delight Farms',
    stoke: 'In Stock',
    freshness: 5,
    buyBy: ['pack'],
    deliveryDays: 2,
    deliveryAria: 'Basel, Switzerland',
    maxKgs: 5,
    description: 'Sweet and juicy organic strawberries, perfect for desserts.',
    rate: 4.9,
    tax: 1.5,
    createdAt: '2025-02-05T08:30:00Z',
    updatedAt: '2025-02-17T10:00:00Z'
  },
  {
    id: 5,
    name: 'Organic Almonds',
    image: [
      'https://www.truly-organics.com/wp-content/uploads/2015/09/Organic-Almonds.jpg'
    ],
    price: 35,
    SKU: 'ALM-1KG-ORG',
    category: 'Nuts & Seeds',
    subcategory: 'Almonds',
    farm: 'NutriHarvest',
    stoke: 'Limited Stock',
    freshness: 4,
    buyBy: ['kg'],
    deliveryDays: 4,
    deliveryAria: 'Lausanne, Switzerland',
    maxKgs: 8,
    description: 'Raw organic almonds, rich in nutrients and perfect for snacking.',
    rate: 4.8,
    tax: 2.2,
    createdAt: '2025-01-30T07:00:00Z',
    updatedAt: '2025-02-16T12:45:00Z'
  },
  {
    id: 6,
    name: 'Fresh Basil',
    image: [
      'https://www.gardenia.net/wp-content/uploads/2023/05/basil-planting-growing-harvesting.webp'
    ],
    price: 6,
    SKU: 'BAS-100-FRESH',
    category: 'Herbs & Spices',
    subcategory: 'Herbs',
    farm: 'Green Leaf Farms',
    stoke: 'In Stock',
    freshness: 5,
    buyBy: ['bunch'],
    deliveryDays: 1,
    deliveryAria: 'Lugano, Switzerland',
    maxKgs: 2,
    description: 'Aromatic fresh basil, perfect for pesto and Italian dishes.',
    rate: 3.6,
    tax: 1,
    createdAt: '2025-02-06T09:15:00Z',
    updatedAt: '2025-02-18T13:00:00Z'
  }
];

export const popularProductsData: ProductItem[] = [
  { id: 1, title: 'Carrots' },
  { id: 2, title: 'Tomatoes' },
  { id: 3, title: 'Potatoes' },
  { id: 4, title: 'Chicken' },
  { id: 5, title: 'Pork' },
];
