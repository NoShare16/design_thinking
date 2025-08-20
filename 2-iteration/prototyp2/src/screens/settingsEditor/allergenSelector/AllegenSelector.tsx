import {Command, CommandGroup, CommandInput, CommandItem, CommandList} from "@/shadcn/components/ui/command.tsx";
import {Check} from "lucide-react";
import "./AllergenSelector.css";

interface AllergenSelectorProps {
  options: string[] | OptionGroup[],
  add: (name: string) => void,
  remove: (name: string) => void,
  selectedAllergens: string[];
}

interface OptionGroup {
  title: string,
  options: string[]
}

export default function AllergenSelector({options, add, remove, selectedAllergens}: AllergenSelectorProps) {
  const isGrouped = (options as OptionGroup[])[0]?.options !== undefined;

  return <Command className="allergenSelector">
    <CommandInput placeholder="Wähle deine Allergien/Unverträglichkeiten"/>
    <CommandList>
      {isGrouped
          ? (options as OptionGroup[]).map((group, i) => (
              <CommandGroup key={i} heading={group.title}>
                {group.options.map((o, i) => (
                    <Option
                        key={i}
                        onSelected={add}
                        onRemoved={remove}
                        selected={selectedAllergens.includes(o)}>
                      {o}
                    </Option>
                ))}
              </CommandGroup>
          )) :
        (options as unknown as string[]).map((v, i) => <Option key={i} onSelected={add} onRemoved={remove} selected={selectedAllergens.includes(v)}>{v}</Option>)
      }
    </CommandList>
  </Command>;
}

function Option({children, onSelected, onRemoved, selected}: {
  children: string,
  onSelected: (value: string) => void,
  onRemoved: (value: string) => void,
  selected: boolean

}) {
  return <CommandItem className="allergenSelectorItem">
    <div onClick={() => {
      if (selected) {
        onRemoved(children)
      } else {
        onSelected(children)
      }
    }}>
      {children}
      <div className="selectionIcon">
        {selected && <Check />}
      </div>
    </div>
  </CommandItem>
}
