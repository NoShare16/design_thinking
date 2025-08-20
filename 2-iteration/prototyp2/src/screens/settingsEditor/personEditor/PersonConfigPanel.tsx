import { useEffect } from "react";
import { useForm } from "react-hook-form";
import AllergenSelector from "@/screens/settingsEditor/allergenSelector/AllegenSelector.tsx";
import { Allergen } from "@/common/Allergens.ts";

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
    const { register, handleSubmit, setValue, getValues, reset } = useForm<Person>({
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
        setValue("allergens", current.filter(a => a !== value), { shouldDirty: true });
    }

    function onSubmit(data: Person) {
        update({ ...data, id: person.id });
        console.log("Updated person:", data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ border: "1px solid gray", padding: 10, borderRadius: 5 }}>
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
                    selectedAllergens={getValues().allergens}
                />
            </div>
            <button type="submit">Speichern</button>
        </form>
    );
}
