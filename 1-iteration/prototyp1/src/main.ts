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

const allergenMatcher = new Map([
  ["en:pork", Allergen.pork],
  ["en:fish", Allergen.fish],
  ["en:celery", Allergen.celery],
  ["en:peanuts", Allergen.peanuts],
  ["en:sulphur-dioxide-and-sulphites", Allergen.sulphur_dioxide_and_sulphites],
  ["en:crustaceans", Allergen.crustaceans],
  ["en:beef", Allergen.beef],
  ["en:eggs", Allergen.eggs],
  ["en:lupin", Allergen.lupin],
  ["en:apple", Allergen.apple],
  ["en:gluten", Allergen.gluten],
  ["en:nuts", Allergen.nuts],
  ["en:soybeans", Allergen.soybeans],
  ["en:orange", Allergen.orange],
  ["en:milk", Allergen.milk],
  ["en:matsutake", Allergen.matsutake],
  ["en:kiwi", Allergen.kiwi],
  ["en:none", Allergen.none],
  ["en:gelatin", Allergen.gelatin],
  ["en:peach", Allergen.peach],
  ["en:sesame-seeds", Allergen.sesame_seeds],
  ["en:banana", Allergen.banana],
  ["en:yamaimo", Allergen.yamaimo],
  ["en:chicken", Allergen.chicken],
  ["en:molluscs", Allergen.molluscs],
  ["en:mustard", Allergen.mustard],
  ["en:red-caviar", Allergen.red_caviar],
])

type EAN = number;

async function main() {
  const userAllergens: Allergen[] = [Allergen.gluten, Allergen.pork, Allergen.fish];

  let fromApi = await getAllergensFromOpenfoodfacts(8594017140580)
  // let fromApi = await getAllergensFromOpenfoodfacts(4071800001012)
  console.log("fromApi", fromApi.map(value => Allergen[value]));

  // match detection
  let warn: Allergen[] = [];
  for (const allergensKey of userAllergens) {
    if (fromApi.includes(allergensKey)) {
      warn.push(allergensKey);
    }
  }

  console.log("Allergens found: " + warn.map(value => Allergen[value]));
}

main().then()

async function getAllergensFromOpenfoodfacts(product: EAN): Promise<Allergen[]> {
  let res = await fetch("https://world.openfoodfacts.org/api/v0/product/" + product + ".json")
  if (!res.ok) {
    console.log("Error getAllergensFromOpenfoodfacts", res);
  }
  let allergs: string = (await res.json()).product.allergens;

  // console.log("rawAllergenString: ", allergs);

  return allergs.split(",").map((product: string) => allergenMatcher.get(product.trim())).filter(value => value !== undefined);
}
