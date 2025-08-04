enum Allergen {
  pork,
  fish,
  celery,
  peanuts,
  sulphur_dioxide_and_sulphites,
  crustaceans,
  beef,
  eggs,
  lupin,
  apple,
  gluten,
  nuts,
  soybeans,
  orange,
  milk,
  matsutake,
  kiwi,
  none,
  gelatin,
  peach,
  sesame_seeds,
  banana,
  yamaimo,
  chicken,
  molluscs,
  mustard,
  red_caviar
}

const allergens: Allergen[] = [Allergen.apple, Allergen.pork, Allergen.fish];

getAllergensFromOpenfoodfacts(5000112546415)

type EAN = number;

async function getAllergensFromOpenfoodfacts(product: EAN): Allergen[] {
  let res = await fetch("https://world.openfoodfacts.org/api/v0/product/" + product + ".json")
  if (!res.ok) {
    console.log("Error getAllergensFromOpenfoodfacts", res);
  }
  console.log("isOk", res.ok);
  let json = await res.json()
  let allergs = json.product.allergens_from_ingredients;

  console.log("Allergen", allergs);
}
