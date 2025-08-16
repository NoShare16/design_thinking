import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command.tsx";
import { useState } from "react";
import "./PersonSelector.css";

interface PersonMenuProps {
  options: string[] | PersonGroup[];
  add: (name: string) => void;
  remove: (name: string) => void;
}

interface PersonGroup {
  options: string[];
}

export default function PersonSelector({ options, add, remove }: PersonMenuProps) {
  const isGrouped = typeof options[0] !== "string";

  return (
      <Command className="personSelector">
        <CommandInput />
        <CommandList>
          {isGrouped
              ? (options as PersonGroup[]).map((group, i) => (
                  <CommandGroup key={i}>
                      {group.options.map((o, i) => (
                          <Option key={i} onSelected={add} onRemoved={remove}>
                              {o}
                          </Option>
                      ))}
                  </CommandGroup>
              ))
              : (options as string[]).map((v, i) => (
                  <Option key={i} onSelected={add} onRemoved={remove}>
                    {v}
                  </Option>
              ))}
        </CommandList>
      </Command>
  );
}

function Option({ children, onSelected, onRemoved }: {
    children: string;
    onSelected: (value: string) => void;
    onRemoved: (value: string) => void;
}) {
    const [selected, setSelected] = useState<boolean>(false);

    return (
        <CommandItem className="personSelectorItem">
            <div
                onClick={() => {
                    if (selected) {
                        onRemoved(children);
                    } else {
                        onSelected(children);
                    }
                    setSelected(!selected);
                }}
            >
                {children}
            </div>
        </CommandItem>
    );
}
