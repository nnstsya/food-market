import { Product, ProductItem } from '@core/models/product.model';

export const productsData: Product[] = [
  {
    id: 1,
    name: 'Fennel mini 200g',
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
  }
];

export const popularProductsData: ProductItem[] = [
  { id: '1', title: 'Carrots' },
  { id: '2', title: 'Tomatoes' },
  { id: '3', title: 'Potatoes' },
  { id: '4', title: 'Chicken' },
  { id: '5', title: 'Pork' },
];
