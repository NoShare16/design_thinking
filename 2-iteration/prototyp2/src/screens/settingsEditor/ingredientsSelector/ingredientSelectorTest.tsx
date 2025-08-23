import {useForm,} from "react-hook-form";
import IngredientSelector from "@/screens/settingsEditor/ingredientsSelector/ingredientSelector.tsx";
import {ingredients} from "@/common/Ingredients.ts";


export default function IngredientSelectorTest() {
  interface TestFormFields {
    ingredients: string[],
  }

  const {handleSubmit, setValue, getValues, watch} = useForm<TestFormFields>({ defaultValues: { ingredients: []}})
  const selectedingredients = watch("ingredients");

  function handleAdd(value: string) {
    if (!selectedingredients.includes(value)) {
      setValue("ingredients", [...getValues().ingredients, value])
    }
  }

  function handleRemove(value: string) {
    const strings = getValues().ingredients;
    const value1 = strings.filter(v => v !== value);
    setValue("ingredients", value1);
  }

  function submit(value: TestFormFields) {
    console.log("submit", value)
  }

  return <div>
    {/* Hier wird das 'ingredients'-Array verwendet */}
    <IngredientSelector
        options={ingredients.map(i => i.name)}
        add={handleAdd}
        remove={handleRemove}
        selectedingredients={selectedingredients}
    />
    <button onClick={handleSubmit(submit)}>Save</button>
  </div>
}
