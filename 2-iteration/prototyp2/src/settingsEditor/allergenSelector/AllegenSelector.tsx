import {Command, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command.tsx";
import {Checkbox} from "@radix-ui/react-checkbox";
import {Switch} from "@/components/ui/switch.tsx";
import {useState} from "react";

interface AllergenSelectorProps {
    options: string[] | OptionGroup[]
}

interface OptionGroup {
    title: string,
    options: string[]
}
export default function AllergenSelector({options}: AllergenSelectorProps) {
    const [set, setSet] = useState(false)
    let isGrouped = typeof options[0] !== "string";
    return <div>
        <Switch checked={set} onCheckedChange={setSet}/>
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
    const [set, setSet] = useState(false)
    return options.map(value => <CommandItem>
        <div style={{backgroundColor: "", flex: 1, cursor: "pointer", justifyItems: "center", flexDirection: "row"}}>
            <Switch checked={set} onCheckedChange={setSet}/>
            <Checkbox>
                {value}
            </Checkbox>
        </div>
    </CommandItem>)
}