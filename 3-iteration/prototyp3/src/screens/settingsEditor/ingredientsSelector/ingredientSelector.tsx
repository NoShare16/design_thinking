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

export default function IngredientSelector({options, add, remove, selectedingredients}: IngredientSelectorProps) {
  const isGrouped = (options as OptionGroup[])[0]?.options !== undefined;

  return <Command className="ingredientSelector">
    <CommandInput placeholder="Wähle deine Unverträglichkeiten"/>
    <CommandList>
      {isGrouped
          ? (options as OptionGroup[]).map((group, i) => (
              <CommandGroup key={i} heading={group.title}>
                {group.options.map((o, i) => (
                    <Option
                        key={i}
                        onSelected={add}
                        onRemoved={remove}
                        selected={selectedingredients.includes(o)}>
                      {o}
                    </Option>
                ))}
              </CommandGroup>
          )) :
          (options as unknown as string[]).map((v, i) =>
              <Option
                  key={i}
                  onSelected={add}
                  onRemoved={remove}
                  selected={selectedingredients.includes(v)}>
                {v}
              </Option>)
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
  const [set, setSet] = useState<boolean>(false)
  return <CommandItem className="ingredientSelectorItem">
    <div onClick={() => {
      if (set || selected) {
        onRemoved(children)
      } else {
        onSelected(children)
      }
      setSet(!set)
    }}>
      {children}
      <div className="selectionIcon">
        {(set || selected) && <Check />}
      </div>
    </div>
  </CommandItem>
}
