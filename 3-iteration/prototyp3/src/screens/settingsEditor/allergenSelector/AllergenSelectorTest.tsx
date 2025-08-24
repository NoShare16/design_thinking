import {useForm,} from "react-hook-form";
import AllergenSelector from "@/screens/settingsEditor/allergenSelector/AllegenSelector.tsx";
import {Allergen} from "@/common/Allergens.ts";


export default function AllergenSelectorTest() {
  interface TestFormFields {
    allergens: string[],
  }

  const {handleSubmit, setValue, getValues, watch} = useForm<TestFormFields>({ defaultValues: { allergens: []}})
  const selectedAllergens = watch("allergens");

  function handleAdd(value: string) {
    setValue("allergens", [...getValues().allergens, value])
  }

  function handleRemove(value: string) {
    const strings = getValues().allergens;
    const value1 = strings.filter(v => v !== value);
    setValue("allergens", value1);
  }

  function submit(value: TestFormFields) {
    console.log("submit", value)
  }

  return <div>
    <AllergenSelector options={Object.keys(Allergen).filter(v => isNaN(Number(v)))} add={handleAdd} remove={handleRemove} selectedAllergens={selectedAllergens}/>
    <button onClick={handleSubmit(submit)}>Save</button>
  </div>
}
