import {Command, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.tsx";
import {useState} from "react";
import {Check} from "lucide-react";
import "./AllergenSelector.css"

interface AllergenSelectorProps {
  options: string[] | OptionGroup[],
  add: (name: string) => void,
  remove: (name: string) => void,
}

interface OptionGroup {
  title: string,
  options: string[]
}

export default function AllergenSelector({options, add, remove}: AllergenSelectorProps) {
  const isGrouped = typeof options[0] !== "string";

  return <Command className="allergenSelector">
    <CommandInput placeholder="Wähle deine Allergien/Unverträglichkeiten"/>
    <CommandList>
      {isGrouped ?
        (options as unknown as OptionGroup[]).map((group, i) => <CommandGroup key={i} heading={group.title}>
          {group.options.map((o, i) => <Option key={i} onSelected={add} onRemoved={remove}>{o}</Option>)}
        </CommandGroup>) :
        (options as unknown as string[]).map((v, i) => <Option key={i} onSelected={add} onRemoved={remove}>{v}</Option>)
      }
    </CommandList>
  </Command>;
}

function Option({children, onSelected, onRemoved}: {
  children: string,
  onSelected: (value: string) => void,
  onRemoved: (value: string) => void
}) {
  const [set, setSet] = useState<boolean>(false)
  return <CommandItem className="allergenSelectorItem">
    {/* Onclick on the CommandItem doesn't work, so helper div it is */}
    <div onClick={() => {
      if (set) {
        onRemoved(children)
      } else {
        onSelected(children)
      }
      setSet(!set)
    }}>
      {children}
      <div className="selectionIcon">
        {set && <Check/>}
      </div>
    </div>
  </CommandItem>
}
