import {Command, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.tsx";
import {Checkbox} from "@radix-ui/react-checkbox";

interface AllergenSelectorProps {
    options: string[] | OptionGroup[]
}

interface OptionGroup {
    title: string,
    options: string[]
}
export default function AllergenSelector({options}: AllergenSelectorProps) {
    let isGrouped = typeof options[0] !== "string";
    return <div>
        <Checkbox>
            tjejdkjeslk
        </Checkbox>
        <Command>
            <CommandInput/>
            <CommandList>
                {isGrouped ? renderGrouping(options as unknown as OptionGroup[]) : renderOptions(options as unknown as string[])}
            </CommandList>
        </Command>
    </div>
}

function renderGrouping(groups: OptionGroup[]) {
    return groups.map(group => <CommandGroup heading={group.title}>
        {renderOptions(group.options)}
    </CommandGroup>)
}

function renderOptions(options: string[]) {
    return options.map(value => <CommandItem>
        <div style={{backgroundColor: "", flex: 1, cursor: "pointer"}}>
            <Checkbox>
        {value}
            </Checkbox>
        </div>
    </CommandItem>)
}