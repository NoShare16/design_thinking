import { useState } from "react";
import PersonSelector from "./PersonSelector.tsx";
import { PersonConfigPanel } from "./PersonConfigPanel";
import {AddButton} from "@/components/ui/addButton.tsx";

interface Person {
    id: string;
    name: string;
    allergens: string[];
}

const availablePeople = [
    { options: ["Ben", "Alex", "Pascal"] },
];

export default function PersonMenu() {
    const [people, setPeople] = useState<Person[]>([]);
    const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
    const [addingNew, setAddingNew] = useState<boolean>(false)

    function handleAdd(name: string) {
        const id = name + "-" + Date.now();
        const newPerson: Person = { id, name, allergens: [] };
        setPeople([...people, newPerson]);
        setSelectedPersonId(id);
        setAddingNew(false);
    }


    function handleRemove(name: string) {
        setPeople(people.filter((p) => p.name !== name));
        if (selectedPersonId) setSelectedPersonId(null);
    }

    const selectedPerson = people.find((p) => p.id === selectedPersonId);

    return (
        <div style={{ display: "flex", gap: "20px" }}>
            <div>
                <h3>Personen</h3>
                <PersonSelector options={availablePeople} add={handleAdd} remove={handleRemove} />

                <AddButton onClick={() => {
                    const id = "new-" + Date.now();
                    setSelectedPersonId(id);
                    setAddingNew(true);
                }}>
                </AddButton>
            </div>

            {selectedPersonId && (
                <PersonConfigPanel
                    person={
                        addingNew
                            ? { id: selectedPersonId, name: "", allergens: [] }
                            : (selectedPerson as Person)
                    }
                    update={(updated) => {
                        if (addingNew) {
                            setPeople([...people, updated]);
                            setAddingNew(false);
                        } else {
                            setPeople(people.map(p => p.id === updated.id ? updated : p));
                        }
                        setSelectedPersonId(null);
                    }}
                />
            )}
        </div>
    );
}
