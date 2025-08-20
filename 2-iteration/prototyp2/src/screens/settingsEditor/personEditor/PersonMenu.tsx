import { useEffect, useState } from "react";
import PersonSelector from "./PersonSelector.tsx";
import { PersonConfigPanel } from "./PersonConfigPanel.tsx";
import { AddButton } from "@/shadcn/components/ui/addButton.tsx";

interface Person {
    id: string;
    name: string;
    allergens: string[];
}

const LS_PEOPLE_KEY = "aa_people";

// Load from localStorage
function loadPeople(): Person[] {
    try {
        const raw = localStorage.getItem(LS_PEOPLE_KEY);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

// Save to localStorage
function savePeople(arr: Person[]) {
    localStorage.setItem(LS_PEOPLE_KEY, JSON.stringify(arr));
}

export default function PersonMenu() {
    const [people, setPeople] = useState<Person[]>(loadPeople);
    const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
    const [addingNew, setAddingNew] = useState(false);

    // persist every change
    useEffect(() => {
        savePeople(people);
    }, [people]);

    // open existing person by id
    const openPerson = (id: string) => {
        setSelectedPersonId(id);
        setAddingNew(false);
    };

    // remove by id (not by name!)
    const removePerson = (id: string) => {
        setPeople(prev => prev.filter(p => p.id !== id));
        if (selectedPersonId === id) setSelectedPersonId(null);
    };

    const selectedPerson = people.find(p => p.id === selectedPersonId) || null;

    return (
        <div style={{ display: "flex", gap: 20 }}>
            <div>
                <h3>Personen</h3>

                {/* zeigt existierende Personen; kein Hinzufügen hier */}
                <PersonSelector
                    people={people}
                    onSelect={openPerson}
                    onRemove={removePerson}
                />

                {/* Neue Person anlegen: erst beim Speichern wirklich in people einfügen */}
                <AddButton
                    onClick={() => {
                        const id = "new-" + Date.now();
                        setSelectedPersonId(id);
                        setAddingNew(true);
                    }}
                />
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
                            // neu anlegen
                            setPeople(prev => [...prev, updated]);
                            setAddingNew(false);
                        } else {
                            // vorhandene Person per id ersetzen
                            setPeople(prev => prev.map(p => (p.id === updated.id ? updated : p)));
                        }
                        setSelectedPersonId(null);
                    }}
                />
            )}
        </div>
    );
}
