import { Product, ProductItem } from '@core/models/product.model';

export const productsData: Product[] = [
  {
    id: 1,
    imageUrl: 'https://d1q864mr06oufu.cloudfront.net/farmy-s3/public/spree/products/142519/large/Reust-Mini_Fenchel__200g-farmy-ch-01.JPG?1726140275',
    title: 'Fennel mini 200g',
    description: 'Price for 1 piece',
    price: 22,
  },
  {
    id: 2,
    imageUrl: 'https://static.wixstatic.com/media/fa4cb1_b7e909a82e6a4fb9bd7fa2dbe616a67b~mv2.jpg/v1/fill/w_520,h_520,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/fa4cb1_b7e909a82e6a4fb9bd7fa2dbe616a67b~mv2.jpg',
    title: 'Eggplant Graffiti',
    description: 'Price for 1 kg',
    price: 19,
  },
  {
    id: 3,
    imageUrl: 'https://www.caterite.co.uk/media/catalog/product/cache/011c574705791770524050d6d2a24703/d/0/d09b98c2a7c670b4eb2a6f96348620d1.jpg',
    title: 'Vacuum boiled whole chestnuts',
    description: 'Price for 1 piece',
    price: 29,
  },
  {
    id: 4,
    imageUrl: 'https://img.taste.com.au/Y5xrT0TD/taste/2013/06/kale-182565-1.jpg',
    title: 'Kale',
    description: 'Price for 1 kg',
    price: 32,
  },
  {
    id: 5,
    imageUrl: 'https://images.squarespace-cdn.com/content/v1/5ec32aea37a8de7bea170760/1609968619441-EQWEE9Z4CTDU88ES4UFA/Fennel',
    title: 'Fennel',
    description: 'Price for 1 kg',
    price: 25,
  },
  {
    id: 6,
    imageUrl: 'https://images.deliveryhero.io/image/fd-th/LH/jtyd-listing.jpg',
    title: 'Raw chestnut - Freshmart',
    description: 'Price for 1 kg',
    price: 26,
  }
];

export const popularProductsData: ProductItem[] = [
  { id: '1', title: 'Carrots' },
  { id: '2', title: 'Tomatoes' },
  { id: '3', title: 'Potatoes' },
  { id: '4', title: 'Chicken' },
  { id: '5', title: 'Pork' },
];
