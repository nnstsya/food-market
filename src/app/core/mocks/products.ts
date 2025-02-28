import { Option } from "@shared/components/dropdown/dropdown.component";
import { BuyBy } from "@core/models/product.model";

export const buyByOptions: Option[] = Object.entries(BuyBy).map(([key, value], index) => ({
  id: index + 1,
  title: value
}));
