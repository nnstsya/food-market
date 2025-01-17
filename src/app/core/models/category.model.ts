export enum Category {
  BAKERY = "BAKERY",
  FRUITANDVEGETABLES = "FRUITANDVEGETABLES",
  MEATANDFISH = "MEATANDFISH",
  DRINKS = "DRINKS",
  KITCHEN = "KITCHEN",
  SPECIALNUTRITION = "SPECIALNUTRITION",
  BABY = "BABY",
  PHARMACY = "PHARMACY",
}

export interface CategoryItem {
  id: string;
  title: string;
}
