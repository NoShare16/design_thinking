import {Command, CommandGroup, CommandInput, CommandItem, CommandList} from "@/shadcn/components/ui/command.tsx";
import {Check} from "lucide-react";
import "./ingredientSelector.css";
import {useState} from "react";

interface IngredientSelectorProps {
  options: string[] | OptionGroup[],
  add: (name: string) => void,
  remove: (name: string) => void,
  selectedingredients: string[];
}

interface OptionGroup {
  title: string,
  options: string[]
}

export default function IngredientSelector({ options, add, remove, selectedingredients }: IngredientSelectorProps) {
    const isGrouped = (options as OptionGroup[])[0]?.options !== undefined;
    const [searchValue, setSearchValue] = useState("");


    const allOptions: string[] = isGrouped
        ? (options as OptionGroup[]).flatMap(group => group.options)
        : (options as unknown as string[]);

    const visibleOptions = searchValue
        ? allOptions.filter(v => v.toLowerCase().includes(searchValue.toLowerCase()))
        : allOptions.filter(v => selectedingredients.includes(v));

    return (
        <Command className="ingredientSelector">
            <CommandInput
                placeholder="Wähle deine Unverträglichkeiten"
                value={searchValue}
                onValueChange={setSearchValue}
            />
            <CommandList>
                {isGrouped
                    ? (options as OptionGroup[]).map((group, i) => {
                        const groupOptions = group.options.filter(o => visibleOptions.includes(o));
                        if (groupOptions.length === 0) return null; // leere Gruppen ausblenden
                        return (
                            <CommandGroup key={i} heading={group.title}>
                                {groupOptions.map((o, j) => (
                                    <Option
                                        key={j}
                                        onSelected={add}
                                        onRemoved={remove}
                                        selected={selectedingredients.includes(o)}
                                    >
                                        {o}
                                    </Option>
                                ))}
                            </CommandGroup>
                        );
                    })
                    : visibleOptions.map((v, i) => (
                        <Option
                            key={i}
                            onSelected={add}
                            onRemoved={remove}
                            selected={selectedingredients.includes(v)}
                        >
                            {v}
                        </Option>
                    ))}
            </CommandList>
        </Command>
    );
}

function Option({children, onSelected, onRemoved, selected}: {
  children: string,
  onSelected: (value: string) => void,
  onRemoved: (value: string) => void,
  selected: boolean
}) {
  return <CommandItem className="ingredientSelectorItem">
    <div onClick={() => {
      if (selected) {
        onRemoved(children)
      } else {
        onSelected(children)
      }
    }}>
      {children}
      <div className="selectionIcon">
        {(selected) && <Check />}
      </div>
    </div>
  </CommandItem>
}
