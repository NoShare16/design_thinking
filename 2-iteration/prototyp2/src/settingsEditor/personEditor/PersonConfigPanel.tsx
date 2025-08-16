import { useForm } from "react-hook-form";
import AllergenSelector from "@/settingsEditor/allergenSelector/AllegenSelector.tsx";
import { Allergen } from "@/common/Allergens";

interface Person {
    id: string;
    name: string;
    allergens: string[];
}

interface PersonConfigPanelProps {
    person: Person;
    update: (person: Person) => void;
}

export function PersonConfigPanel({ person, update }: PersonConfigPanelProps) {
    const { register, handleSubmit, setValue, getValues } = useForm<Person>({
        defaultValues: person
    });

    function handleAddAllergen(value: string) {
        setValue("allergens", [...getValues().allergens, value]);
    }

    function handleRemoveAllergen(value: string) {
        setValue("allergens", getValues().allergens.filter((a) => a !== value));
    }

    function onSubmit(data: Person) {
        update(data);
        console.log("Updated person:", data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ border: "1px solid gray", padding: "10px", borderRadius: "5px" }}>
            <div>
                <label>Name:</label>
                <input {...register("name")} />
            </div>

            <div>
                <label>Allergene:</label>
                <AllergenSelector
                    options={Object.keys(Allergen).filter(v => isNaN(Number(v)))}
                    add={handleAddAllergen}
                    remove={handleRemoveAllergen}
                />
            </div>

            <button type="submit">Save</button>
        </form>
    );
}
