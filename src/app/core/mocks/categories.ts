import { Category, CategoryItem } from '@core/models/category.model';

export const categoriesData: Record<Category, string> = {
  [Category.BAKERY]: "Bakery",
  [Category.FRUITANDVEGETABLES]: "Fruit and vegetables",
  [Category.MEATANDFISH]: "Meat and fish",
  [Category.DRINKS]: "Drinks",
  [Category.KITCHEN]: "Kitchen",
  [Category.SPECIALNUTRITION]: "Special nutrition",
  [Category.BABY]: "Baby",
  [Category.PHARMACY]: "Pharmacy",
};

export const categoryData: CategoryItem[] = Object.entries(categoriesData)
  .map(([_, value], index) => ({
    id: index + 1,
    title: value
  }));

export const popularCategoryData: CategoryItem[] = [
  {
    id: 1,
    title: 'Carrots'
  },
  {
    id: 2,
    title: 'Tomatoes'
  },
  {
    id: 3,
    title: 'Potatoes'
  },
  {
    id: 4,
    title: 'Chicken'
  },
  {
    id: 5,
    title: 'Pork'
  }
];
