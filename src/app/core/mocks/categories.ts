import { Category } from '@core/models/category.model';
import { Option } from "@shared/components/dropdown/dropdown.component";

export const categoryData: Option[] = [
  {
    id: 1,
    title: 'Bakery'
  },
  {
    id: 2,
    title: 'Fruit and vegetables'
  },
  {
    id: 3,
    title: 'Meat and fish'
  },
  {
    id: 4,
    title: 'Drinks'
  },
  {
    id: 5,
    title: 'Kitchen'
  },
  {
    id: 6,
    title: 'Special nutrition'
  },
  {
    id: 7,
    title: 'Baby'
  },
  {
    id: 8,
    title: 'Pharmacy'
  }
];

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

export const popularCategoryData: string[] = ['Carrots', 'Tomatoes', 'Potatoes', 'Chicken', 'Pork']
