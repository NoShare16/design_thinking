import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/shadcn/components/ui/command.tsx";
import "./PersonSelector.css";

interface Person {
    id: string;
    name: string;
    allergens: string[];
}

interface Props {
    people: Person[];
    onSelect: (id: string) => void;
    onRemove: (id: string) => void;
}

export default function PersonSelector({ people, onSelect, onRemove }: Props) {
    return (
        <Command className="personSelector">
            <CommandInput placeholder="Person suchen..." />
            <CommandList>
                <CommandGroup>
                    {people.map((p) => (
                        <CommandItem
                            key={p.id}
                            className="personSelectorItem"
                            // CommandItem hat onSelect-Event-API
                            onSelect={() => onSelect(p.id)}
                        >
                            <div>
                                {p.name}
                                {/* getrennte Remove-Aktion; stopPropagation, damit kein Select auslöst */}
                                <button
                                    type="button"
                                    className="selectionIcon"
                                    aria-label={`Person ${p.name} löschen`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemove(p.id);
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
    );
}
