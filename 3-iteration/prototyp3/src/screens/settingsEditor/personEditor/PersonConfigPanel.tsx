import { useEffect } from "react";
import { useForm } from "react-hook-form";
import AllergenSelector from "@/screens/settingsEditor/allergenSelector/AllegenSelector.tsx";
import { Allergen } from "@/common/Allergens.ts";
import IngredientSelector from "@/screens/settingsEditor/ingredientsSelector/ingredientSelector.tsx";
import { ingredients } from "@/common/Ingredients.ts";
import { X } from "lucide-react";
import "./PersonMenu.css";

interface Person {
  id: string;
  name: string;
  allergens: string[];
  ingredients: string[];
}

interface PersonConfigPanelProps {
  person: Person;
  update: (person: Person) => void;
  onClose: () => void;
}

export function PersonConfigPanel({
  person,
  update,
  onClose,
}: PersonConfigPanelProps) {
  const { register, handleSubmit, setValue, getValues, reset } =
    useForm<Person>({
      defaultValues: person,
    });

  useEffect(() => {
    reset(person);
  }, [person, reset]);

  function handleAddAllergen(value: string) {
    const current = getValues().allergens ?? [];
    if (current.includes(value)) return;
    setValue("allergens", [...current, value], { shouldDirty: true });
  }

  function handleRemoveAllergen(value: string) {
    const current = getValues().allergens ?? [];
    setValue(
      "allergens",
      current.filter((a) => a !== value),
      { shouldDirty: true }
    );
  }

  function handleAddIngredient(value: string) {
    const current = getValues().ingredients ?? [];
    if (current.includes(value)) return;
    setValue("ingredients", [...current, value], { shouldDirty: true });
  }

  function handleRemoveIngredient(value: string) {
    const current = getValues().ingredients ?? [];
    setValue(
      "ingredients",
      current.filter((a) => a !== value),
      { shouldDirty: true }
    );
  }

  function onSubmit(data: Person) {
    update({ ...data, id: person.id });
    console.log("Updated person:", data);
  }

  return (
    <div className="fullscreenPanel">
      <button className="closeButton" onClick={onClose} aria-label="Schließen">
        <X size={25} />
      </button>

      <form className="configForm" onSubmit={handleSubmit(onSubmit)}>
        <div className="formGroup">
          <label>Name:</label>
          <input {...register("name")} className="formInput" />
        </div>

        <div className="formGroup">
          <label>Allergene:</label>
          <AllergenSelector
            options={Object.keys(Allergen).filter((v) => isNaN(Number(v)))}
            add={handleAddAllergen}
            remove={handleRemoveAllergen}
            selectedAllergens={getValues().allergens}
          />
        </div>

        <div className="formGroup">
          <label>Ingredients:</label>
          <IngredientSelector
            options={ingredients
              .map((i) => i.name)
              .filter((v) => isNaN(Number(v)))}
            add={handleAddIngredient}
            remove={handleRemoveIngredient}
            selectedingredients={getValues().ingredients || []}
          />
        </div>

        <div className="formActions">
          <button type="submit" className="btn btn--accent">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
