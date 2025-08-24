import { useEffect, useState } from "react";
import PersonSelector from "./PersonSelector.tsx";
import { PersonConfigPanel } from "./PersonConfigPanel.tsx";
import { AddButton } from "@/shadcn/components/ui/addButton.tsx";
import {ArrowLeft} from "lucide-react";
import "./PersonMenu.css";
import {useNavigate} from "react-router-dom";

interface Person {
    id: string;
    name: string;
    allergens: string[];
    ingredients: string[];
}

const LS_PEOPLE_KEY = "allergenProfiles";

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

function savePeople(arr: Person[]) {
    localStorage.setItem(LS_PEOPLE_KEY, JSON.stringify(arr));
}


export default function PersonMenu() {
    const [people, setPeople] = useState<Person[]>(loadPeople);
    const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
    const [addingNew, setAddingNew] = useState(false);

    useEffect(() => {
        savePeople(people);
    }, [people]);

    const openPerson = (id: string) => {
        setSelectedPersonId(id);
        setAddingNew(false);
    };

    const removePerson = (id: string) => {
        setPeople(prev => prev.filter(p => p.id !== id));
        if (selectedPersonId === id) setSelectedPersonId(null);
    };

    const selectedPerson = people.find(p => p.id === selectedPersonId) || null;
    const navigate = useNavigate();

    return (
        <div className="personMenuLayout">
            <div className="personMenuSidebar">
                <div className="sidebarHeader">
                    <header onClick={() => navigate("/")}>
                        <ArrowLeft/><h1>Person Menu</h1>
                    </header>
                </div>
                <div className="sidebarSearch">
                    <PersonSelector
                        people={people}
                        onSelect={openPerson}
                        onRemove={removePerson}
                    />
                </div>
                <div className="sidebarFooter">
                    <AddButton className="btn btn--accent"
                        onClick={() => {
                            const id = "new-" + Date.now();
                            setSelectedPersonId(id);
                            setAddingNew(true);
                        }}>
                    </AddButton>
                </div>
            </div>

            {selectedPersonId && (
                <div className="fullscreenPanel">
                    <PersonConfigPanel
                        person={
                            addingNew
                                ? { id: selectedPersonId, name: "", allergens: [], ingredients: [] }
                                : (selectedPerson as Person)
                        }
                        update={(updated) => {
                            if (addingNew) {
                                setPeople((prev) => [...prev, updated]);
                                setAddingNew(false);
                                setSelectedPersonId(updated.id);
                            } else {
                                setPeople((prev) =>
                                    prev.map((p) => (p.id === updated.id ? updated : p))
                                );
                            }
                            setSelectedPersonId(null);
                        }}
                        onClose={() => setSelectedPersonId(null)}
                    />
                </div>
            )}
        </div>
    );
}
