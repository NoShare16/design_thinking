import OpenFoodFacts from "openfoodfacts_nodejs";

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

const client = new OpenFoodFacts();
client.getAllergens("5000112546415").then((it) => console.log(it));


