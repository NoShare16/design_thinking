
export interface FoodWarningReturn {
  person_name: string;
  matching_allergens: string[];
  matching_ingredients: string[];
  has_warning: boolean;
}

// export default function useFoodWarningMock(persons: any[], product: ProductInfo | undefined) : FoodWarningReturn[] {
//   return [{
//     has_warning: true,
//     matching_allergens: [Allergen.sesame_seeds, Allergen.lupin],
//     matching_ingredients: ["en:thiamin", "en:thjuwhiwdhwiadhioh"],
//     person_name: "h",
//   }, {
//     has_warning: false,
//     matching_allergens: [Allergen.sesame_seeds, Allergen.lupin],
//     matching_ingredients: ["en:thiamin"],
//     person_name: "hidfwiwaiiwdhidw"
//   }, {
//     has_warning: true,
//     matching_allergens: [Allergen.sesame_seeds, Allergen.lupin],
//     matching_ingredients: ["en:thiamin"],
//     person_name: "hidfwiwaiiwdhidw"
//   }, {
//     has_warning: true,
//     matching_allergens: [Allergen.sesame_seeds, Allergen.lupin],
//     matching_ingredients: ["en:thiamin"],
//     person_name: "hidfwiwaiiwdhidw"
//   }, {
//     has_warning: false,
//     matching_allergens: [Allergen.sesame_seeds, Allergen.lupin],
//     matching_ingredients: ["en:thiamin"],
//     person_name: "hidfwiwaiiwdhidw"
//   }, {
//     has_warning: false,
//     matching_allergens: [Allergen.sesame_seeds, Allergen.lupin],
//     matching_ingredients: ["en:thiamin"],
//     person_name: "hidfwiwaiiwdhidw"
//   }, {
//     has_warning: true,
//     matching_allergens: [Allergen.sesame_seeds, Allergen.lupin],
//     matching_ingredients: ["en:thiamin"],
//     person_name: "hidfwiwaiiwdhidw"
//   }, {
//     has_warning: false,
//     matching_allergens: [Allergen.sesame_seeds, Allergen.lupin],
//     matching_ingredients: ["en:thiamin"],
//     person_name: "hidfwiwaiiwdhidw"
//   }]
// }
