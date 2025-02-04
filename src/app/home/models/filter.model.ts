export type FilterType = 'checkbox' | 'tag' | 'range';

export interface FilterValue {
  id: string;
  label: string;
  count?: number;
  checked: boolean;
  type: FilterType;
}

export interface RatingCheckbox extends Omit<FilterValue, 'label'> {
  ratingArray: number[];
}

export interface PriceRange {
  min: number;
  max: number;
  current: {
    min: number;
    max: number;
  };
}

export interface FilterState {
  wishlist: FilterValue;
  nonWishlist: FilterValue;
  ratings: RatingCheckbox[];
  priceRange: PriceRange;
}

export interface ActiveFilter {
  id: string;
  label: string;
  type: FilterType;
  checked?: boolean;
  ratingArray?: number[];
  priceRange?: PriceRange;
}
